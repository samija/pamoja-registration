import type { PaymentGateway } from "./gateway";
import { chapaGateway } from "./chapa";
import { mpesaGateway } from "./mpesa";
import { paystackGateway } from "./paystack";

const gateways: Record<string, PaymentGateway> = {
  chapa: chapaGateway,
  mpesa: mpesaGateway,
  paystack: paystackGateway,
};

export function getGateway(name: string): PaymentGateway {
  const gw = gateways[name];
  if (!gw) throw new Error(`Unknown payment gateway: ${name}`);
  return gw;
}
