export interface CustomerProfile {
  phone: string;
  name: string;
  email: string;
  addresses: string[];
}

export interface CustomerProfilePayload {
  phone: string;
  name?: string;
  email?: string;
  addresses?: string[];
}
