export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'USUARIO';
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
