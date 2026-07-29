export interface ISignUp {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

export interface SignUpReq{
  email: string,
  password: string,
  data: {
    name: string,
    department: string
  }
}
