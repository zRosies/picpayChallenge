export interface Transaction {
  value: string;
  payer_id: string;
  receiver_id: string;
}

export interface Account {
  user_id: string;
  name: string;
  cpf: string;
  email: string;
  senha: string;
  store_owner: false;
}
