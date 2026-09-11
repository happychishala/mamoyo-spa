import QRCode from "qrcode";

/** Render a QR code for `text` as an inline SVG string (crisp at any print size). */
export function qrSvg(text: string, opts?: { margin?: number }): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: opts?.margin ?? 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}
