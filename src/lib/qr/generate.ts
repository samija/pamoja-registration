import QRCode from "qrcode";

export async function generateQRCode(registrantId: string): Promise<string> {
  const data = JSON.stringify({
    type: "pamoja-checkin",
    id: registrantId,
    ts: Date.now(),
  });

  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: "#0A1002",
      light: "#FFFFFF",
    },
  });
}

export async function generateQRCodeSVG(registrantId: string): Promise<string> {
  const data = JSON.stringify({
    type: "pamoja-checkin",
    id: registrantId,
  });

  return QRCode.toString(data, {
    type: "svg",
    width: 300,
    margin: 2,
    color: {
      dark: "#0A1002",
      light: "#FFFFFF",
    },
  });
}
