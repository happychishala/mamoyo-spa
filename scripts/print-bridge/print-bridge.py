#!/usr/bin/env python3
"""
MaMoyo POS -> Epson print bridge.

Runs on ONE computer on the café's local network. It polls the website for
pending POS receipts and prints them to the Epson receipt printer over the
network (raw ESC/POS on TCP 9100). Works for every till (tablet or PC) because
the tills just create receipts on the site; this one bridge does the printing.

Configure with environment variables (or edit the defaults below):

  SITE_URL            https://mamoyowellness.com
  PRINT_BRIDGE_TOKEN  the same secret set in the site's Vercel env
  PRINTER_IP          192.168.1.171
  PRINTER_PORT        9100
  POLL_SECONDS        3
  RECEIPT_WIDTH       48     (characters; 48 for 80mm font A, 32 for 58mm)

Run:  PRINT_BRIDGE_TOKEN=xxxx python3 print-bridge.py
Needs Python 3 and 'requests'  (pip install requests).
"""

import os
import socket
import time
import requests

SITE_URL = os.environ.get("SITE_URL", "https://mamoyowellness.com").rstrip("/")
TOKEN = os.environ.get("PRINT_BRIDGE_TOKEN", "")
PRINTER_IP = os.environ.get("PRINTER_IP", "192.168.1.171")
PRINTER_PORT = int(os.environ.get("PRINTER_PORT", "9100"))
POLL_SECONDS = int(os.environ.get("POLL_SECONDS", "3"))
WIDTH = int(os.environ.get("RECEIPT_WIDTH", "48"))

ESC = b"\x1b"
GS = b"\x1d"
INIT = ESC + b"@"
ALIGN_CENTER = ESC + b"\x61\x01"
ALIGN_LEFT = ESC + b"\x61\x00"
BOLD_ON = ESC + b"\x45\x01"
BOLD_OFF = ESC + b"\x45\x00"
DOUBLE_ON = GS + b"\x21\x11"
DOUBLE_OFF = GS + b"\x21\x00"
CUT = GS + b"\x56\x00"


def enc(s):
    return s.encode("cp437", "replace")


def row(left, right):
    """left text + right text, right-aligned to WIDTH."""
    left = str(left)
    right = str(right)
    space = WIDTH - len(left) - len(right)
    if space < 1:
        left = left[: max(0, WIDTH - len(right) - 1)]
        space = WIDTH - len(left) - len(right)
    return enc(left + " " * max(1, space) + right) + b"\n"


def build_receipt(r):
    b = bytearray()
    b += INIT
    b += ALIGN_CENTER + BOLD_ON + DOUBLE_ON + enc(r["title"]) + b"\n" + DOUBLE_OFF + BOLD_OFF
    b += enc(r.get("branch", "")) + b"\n"
    if r.get("address"):
        b += enc(r["address"]) + b"\n"
    if r.get("phone"):
        b += enc(r["phone"]) + b"\n"
    b += ALIGN_LEFT
    b += enc("-" * WIDTH) + b"\n"
    b += row("Receipt", r["number"])
    b += row("Date", r["date"])
    b += row("Ref", r["reference"])
    b += row("Customer", r["customer"])
    b += enc("-" * WIDTH) + b"\n"

    for it in r.get("items", []):
        b += enc(str(it["name"])) + b"\n"
        b += row("  %s x %s" % (it["qty"], it["price"]), it["amount"])

    b += enc("-" * WIDTH) + b"\n"
    b += row("Subtotal excl. VAT", r["subtotal"])
    b += row("VAT (%s)" % r.get("vatRate", ""), r["vat"])
    b += BOLD_ON + DOUBLE_ON + row("TOTAL", r["total"]) + DOUBLE_OFF + BOLD_OFF
    b += enc("-" * WIDTH) + b"\n"

    if r.get("payments"):
        b += enc("Paid by:") + b"\n"
        for p in r["payments"]:
            b += row(p["method"], p["amount"])
    else:
        b += row("Paid by", r.get("method", ""))

    b += ALIGN_CENTER + b"\n" + enc("Thank you - see you again!") + b"\n"
    b += enc("spa - cafe - suites - wellness") + b"\n"
    b += b"\n\n\n" + CUT
    return bytes(b)


def send_to_printer(data):
    with socket.create_connection((PRINTER_IP, PRINTER_PORT), timeout=5) as s:
        s.sendall(data)


def poll_once():
    headers = {"Authorization": "Bearer %s" % TOKEN}
    resp = requests.get("%s/api/print-jobs" % SITE_URL, headers=headers, timeout=10)
    resp.raise_for_status()
    jobs = resp.json().get("jobs", [])
    printed = []
    for job in jobs:
        try:
            send_to_printer(build_receipt(job["receipt"]))
            printed.append(job["id"])
            print("Printed receipt %s" % job["receipt"]["number"])
        except Exception as e:  # printer offline etc. -> leave job pending, retry
            print("Print failed (%s) - will retry" % e)
            break
    if printed:
        requests.post(
            "%s/api/print-jobs" % SITE_URL,
            headers=headers,
            json={"ids": printed},
            timeout=10,
        )


def main():
    if not TOKEN:
        raise SystemExit("Set PRINT_BRIDGE_TOKEN (must match the site's env var).")
    print("MaMoyo print bridge -> %s:%s, polling %s every %ss"
          % (PRINTER_IP, PRINTER_PORT, SITE_URL, POLL_SECONDS))
    while True:
        try:
            poll_once()
        except Exception as e:
            print("Poll error: %s" % e)
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    main()
