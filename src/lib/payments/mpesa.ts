import type { PaymentGateway, PaymentInitRequest, PaymentInitResponse, PaymentVerifyResponse } from "./gateway";

const DARAJA_BASE_URL = process.env.MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("M-Pesa credentials not set");

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await res.json();
  return data.access_token;
}

function formatPhone(phone: string): string {
  // Convert +254xxx to 254xxx
  return phone.replace(/^\+/, "").replace(/^0/, "254");
}

export const mpesaGateway: PaymentGateway = {
  name: "mpesa",

  async initiate(req: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      const token = await getAccessToken();
      const shortcode = process.env.MPESA_SHORTCODE!;
      const passkey = process.env.MPESA_PASSKEY!;

      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

      const res = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(req.amount),
          PartyA: formatPhone(req.phone || ""),
          PartyB: shortcode,
          PhoneNumber: formatPhone(req.phone || ""),
          CallBackURL: req.callbackUrl,
          AccountReference: req.txRef,
          TransactionDesc: req.description || "Pamoja Registration",
        }),
      });

      const data = await res.json();

      if (data.ResponseCode === "0") {
        // STK push initiated — no checkout URL, user gets prompt on phone
        return {
          success: true,
          checkoutUrl: null, // M-Pesa uses STK push, no redirect
          txRef: req.txRef,
        };
      }

      return {
        success: false,
        checkoutUrl: null,
        txRef: req.txRef,
        error: data.errorMessage || data.ResponseDescription || "M-Pesa STK push failed",
      };
    } catch (error) {
      return {
        success: false,
        checkoutUrl: null,
        txRef: req.txRef,
        error: error instanceof Error ? error.message : "M-Pesa initiation failed",
      };
    }
  },

  async verify(txRef: string): Promise<PaymentVerifyResponse> {
    try {
      const token = await getAccessToken();
      const shortcode = process.env.MPESA_SHORTCODE!;
      const passkey = process.env.MPESA_PASSKEY!;

      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

      const res = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: txRef,
        }),
      });

      const data = await res.json();

      if (data.ResultCode === "0") {
        return {
          success: true,
          status: "completed",
          txRef,
          amount: 0, // M-Pesa doesn't return amount in query
          currency: "KES",
          gatewayResponse: data,
        };
      }

      return {
        success: false,
        status: data.ResultCode === "1032" ? "failed" : "pending",
        txRef,
        amount: 0,
        currency: "KES",
        gatewayResponse: data,
      };
    } catch {
      return {
        success: false,
        status: "failed",
        txRef,
        amount: 0,
        currency: "KES",
        gatewayResponse: {},
      };
    }
  },
};
