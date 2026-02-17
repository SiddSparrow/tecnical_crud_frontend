import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, CreateClienteDto, UpdateClienteDto, CnpjLookupResult } from '../models/cliente.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly API = '/api/v1/clientes';

  list(page = 1, limit = 10): Observable<PaginatedResponse<Cliente>> {
    return this.http.get<PaginatedResponse<Cliente>>(this.API, {
      params: { page, limit },
    });
  }

  getById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API}/${id}`);
  }

  create(data: CreateClienteDto): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, data);
  }

  update(id: string, data: UpdateClienteDto): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  consultaCnpj(cnpj: string): Observable<CnpjLookupResult> {
    const digits = cnpj.replace(/\D/g, '');
    return this.http.get<CnpjLookupResult>(`${this.API}/consulta-cnpj/${digits}`);
  }
}
