export interface Cliente {
  id: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteDto {
  razaoSocial: string;
  cnpj: string;
  email: string;
}

export interface UpdateClienteDto {
  razaoSocial?: string;
  cnpj?: string;
  email?: string;
}

export interface CnpjLookupResult {
  razaoSocial: string;
  cnpj: string;
  email?: string;
}
