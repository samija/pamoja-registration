import type { PaymentGateway, PaymentInitRequest, PaymentInitResponse, PaymentVerifyResponse } from "./gateway";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export const paystackGateway: PaymentGateway = {
  name: "paystack",

  async initiate(req: PaymentInitRequest): Promise<PaymentInitResponse> {
    try {
      const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: req.email,
          amount: Math.round(req.amount * 100), // Paystack uses kobo (NGN * 100)
          currency: req.currency,
          reference: req.txRef,
          callback_url: req.returnUrl,
          metadata: {
            first_name: req.firstName,
            last_name: req.lastName,
            phone: req.phone,
            description: req.description,
          },
        }),
      });

      const data = await res.json();

      if (data.status === true && data.data) {
        return {
          success: true,
          checkoutUrl: data.data.authorization_url,
          txRef: data.data.reference,
        };
      }

      return {
        success: false,
        checkoutUrl: null,
        txRef: req.txRef,
        error: data.message || "Paystack initialization failed",
      };
    } catch (error) {
      return {
        success: false,
        checkoutUrl: null,
        txRef: req.txRef,
        error: error instanceof Error ? error.message : "Paystack initiation failed",
      };
    }
  },

  async verify(txRef: string): Promise<PaymentVerifyResponse> {
    try {
      const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${txRef}`, {
        headers: { Authorization: `Bearer ${getSecretKey()}` },
      });

      const data = await res.json();

      if (data.status === true && data.data) {
        const status = data.data.status === "success" ? "completed" :
                       data.data.status === "abandoned" ? "failed" : "pending";
        return {
          success: true,
          status,
          txRef,
          amount: data.data.amount / 100, // Convert from kobo
          currency: data.data.currency,
          gatewayResponse: data.data,
        };
      }

      return {
        success: false,
        status: "failed",
        txRef,
        amount: 0,
        currency: "NGN",
        gatewayResponse: data,
      };
    } catch {
      return {
        success: false,
        status: "failed",
        txRef,
        amount: 0,
        currency: "NGN",
        gatewayResponse: {},
      };
    }
  },
};
