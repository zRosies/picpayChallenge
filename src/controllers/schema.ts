export interface Transaction {
  value: number;
  payer_id: string;
  receiver_id: string;
  transaction_type: string;
  date: string;
  status?: string;
}

export interface Account {
  user_id: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  store_owner: false;
}
