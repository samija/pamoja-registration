import type { PaymentGateway, PaymentInitRequest, PaymentInitResponse, PaymentVerifyResponse } from "./gateway";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

function getSecretKey(): string {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) throw new Error("CHAPA_SECRET_KEY is not set");
  return key;
}

export const chapaGateway: PaymentGateway = {
  name: "chapa",

  async initiate(req: PaymentInitRequest): Promise<PaymentInitResponse> {
    const res = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: req.amount.toString(),
        currency: req.currency,
        email: req.email,
        first_name: req.firstName,
        last_name: req.lastName,
        phone_number: req.phone,
        tx_ref: req.txRef,
        callback_url: req.callbackUrl,
        return_url: req.returnUrl,
        customization: {
          title: "Pamoja Africa V Registration",
          description: req.description || "Conference Registration",
        },
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      return {
        success: true,
        checkoutUrl: data.data.checkout_url,
        txRef: req.txRef,
      };
    }

    return {
      success: false,
      checkoutUrl: null,
      txRef: req.txRef,
      error: data.message || "Failed to initialize payment",
    };
  },

  async verify(txRef: string): Promise<PaymentVerifyResponse> {
    const res = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    });

    const data = await res.json();

    if (data.status === "success" && data.data) {
      const txStatus = data.data.status === "success" ? "completed" :
                       data.data.status === "pending" ? "pending" : "failed";
      return {
        success: true,
        status: txStatus,
        txRef,
        amount: parseFloat(data.data.amount),
        currency: data.data.currency,
        gatewayResponse: data.data,
      };
    }

    return {
      success: false,
      status: "failed",
      txRef,
      amount: 0,
      currency: "",
      gatewayResponse: data,
    };
  },
};
