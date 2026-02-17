import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProdutoDto, Produto, UpdateProdutoDto } from '../models/produto.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/v1/produtos`;

  list(page = 1, limit = 10): Observable<PaginatedResponse<Produto>> {
    return this.http.get<PaginatedResponse<Produto>>(this.API, {
      params: { page, limit },
    });
  }

  getById(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  create(data: CreateProdutoDto): Observable<Produto> {
    return this.http.post<Produto>(this.API, data);
  }

  update(id: string, data: UpdateProdutoDto): Observable<Produto> {
    return this.http.patch<Produto>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  uploadImages(produtoId: string, files: File[]): Observable<Produto> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return this.http.post<Produto>(`${this.API}/${produtoId}/imagens`, formData);
  }

  deleteImage(produtoId: string, imagemId: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${produtoId}/imagens/${imagemId}`);
  }
}
