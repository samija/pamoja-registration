/** Unified Payment Gateway Interface */

export interface PaymentInitRequest {
  amount: number;
  currency: string;
  txRef: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  callbackUrl: string;
  returnUrl: string;
  description?: string;
}

export interface PaymentInitResponse {
  success: boolean;
  checkoutUrl: string | null;
  txRef: string;
  error?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: "completed" | "pending" | "failed";
  txRef: string;
  amount: number;
  currency: string;
  gatewayResponse: Record<string, unknown>;
}

export interface PaymentGateway {
  name: string;
  initiate(req: PaymentInitRequest): Promise<PaymentInitResponse>;
  verify(txRef: string): Promise<PaymentVerifyResponse>;
}
