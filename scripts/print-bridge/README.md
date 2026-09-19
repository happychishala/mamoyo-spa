# MaMoyo POS print bridge (Epson)

Prints POS receipts to an Epson network receipt printer automatically, for every
till (tablet or PC), without any per-device setup.

**Why a bridge?** A website in a browser can't open a raw socket to a printer,
and a site served over HTTPS can't talk to a printer's local (HTTP) address.
Instead, each till just creates the receipt on the site; this small program —
running on one computer on the same network as the printer — pulls new receipts
and sends them to the Epson over TCP 9100 (ESC/POS), exactly like a till driver.

```
 Tablet / PC (any till) ──HTTPS──> mamoyowellness.com  (queues the receipt)
                                          ▲
                                          │ poll over HTTPS (Bearer token)
                                  print-bridge.py  ──TCP 9100 (ESC/POS)──> Epson
        (one computer on the café LAN, e.g. 192.168.1.x)
```

## Setup (once)

1. **On the website (Vercel):** add an environment variable
   `PRINT_BRIDGE_TOKEN` = a long random secret, then redeploy. (This is what
   authorises the bridge to read the print queue — keep it private.)

2. **On a computer on the café network** (Windows/Mac/Linux, or a cheap mini-PC
   left on at the counter): install Python 3 and `requests`:

   ```bash
   pip install requests
   ```

3. **Run the bridge**, pointing it at your printer and token:

   ```bash
   PRINT_BRIDGE_TOKEN=your-secret \
   PRINTER_IP=192.168.1.171 \
   SITE_URL=https://mamoyowellness.com \
   python3 print-bridge.py
   ```

   Leave it running. New POS sales print within a few seconds.

## Options (environment variables)

| Variable | Default | Notes |
|---|---|---|
| `PRINT_BRIDGE_TOKEN` | — | **Required.** Must match the site's env var. |
| `PRINTER_IP` | `192.168.1.171` | Your Epson's network address. |
| `PRINTER_PORT` | `9100` | Raw/ESC-POS port. |
| `SITE_URL` | `https://mamoyowellness.com` | The live site. |
| `POLL_SECONDS` | `3` | How often to check for new receipts. |
| `RECEIPT_WIDTH` | `48` | Characters per line: 48 for 80 mm paper, 32 for 58 mm. |

## Keep it running automatically

- **Windows:** Task Scheduler → run at logon; or NSSM to run as a service.
- **Mac/Linux:** a `launchd`/`systemd` unit, or `pm2 start print-bridge.py --interpreter python3`.

## Notes

- If the printer is off or unreachable, jobs stay queued and print when it's
  back — nothing is lost.
- Tablets that can't run the bridge still print fine: the receipt page also has a
  normal browser Print (A4 or 80 mm) that uses AirPrint/Mopria to the same Epson.
