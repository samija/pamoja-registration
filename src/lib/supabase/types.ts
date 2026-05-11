export type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "waitlisted";
export type PaymentStatus = "initiated" | "pending" | "completed" | "failed" | "refunded";

export interface Country {
  id: string;
  slug: string;
  name: string;
  name_local: string | null;
  currency: string;
  currency_symbol: string;
  locale: string;
  payment_gateway: string;
  timezone: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Conference {
  id: string;
  slug: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CountryConference {
  id: string;
  country_id: string;
  conference_id: string;
  price_local: number;
  currency: string;
  is_active: boolean;
  conference?: Conference;
}

export interface Registrant {
  id: string;
  country_id: string;
  conference_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  organization: string | null;
  role: string | null;
  city: string | null;
  group_id: string | null;
  qr_code: string | null;
  checked_in: boolean;
  status: RegistrationStatus;
  locale: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  country?: Country;
  conference?: Conference;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  registrant_id: string;
  gateway: string;
  gateway_tx_ref: string | null;
  gateway_response: Record<string, unknown> | null;
  amount_local: number;
  currency_local: string;
  exchange_rate: number | null;
  amount_usd: number | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  registrant?: Registrant;
}

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface Group {
  id: string;
  country_id: string;
  name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string | null;
  organization: string | null;
  size: number;
  created_at: string;
  registrants?: Registrant[];
}

export interface Document {
  id: string;
  registrant_id: string;
  type: string;
  file_path: string;
  file_name: string;
  status: VerificationStatus;
  reviewed_by: string | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Checkin {
  id: string;
  registrant_id: string;
  checked_in_by: string | null;
  checked_in_at: string;
  method: string;
  notes: string | null;
}

export interface RegistrationFormData {
  conferenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  organization: string;
  role: string;
  city: string;
}
