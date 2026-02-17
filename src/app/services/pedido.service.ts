import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePedidoDto, Pedido } from '../models/pedido.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/v1/pedidos`;

  list(page = 1, limit = 10): Observable<PaginatedResponse<Pedido>> {
    return this.http.get<PaginatedResponse<Pedido>>(this.API, {
      params: { page, limit },
    });
  }

  getById(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API}/${id}`);
  }

  create(data: CreatePedidoDto): Observable<Pedido> {
    return this.http.post<Pedido>(this.API, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
