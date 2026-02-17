import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-produto-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produto-list.html',
})
export class ProdutoList implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  protected readonly authService = inject(AuthService);

  produtos: Produto[] = [];
  page = 1;
  totalPages = 1;
  pageNumbers: number[] = [1];
  limit = 10;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.produtoService.list(this.page, this.limit).subscribe({
      next: (res) => {
        this.produtos = res.data;
        this.totalPages = res.totalPages;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar produtos.';
        this.loading = false;
      },
    });
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadProdutos();
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Excluir produto?',
      text: 'Todas as imagens também serão excluídas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, excluir',
    }).then((result) => {
      if (result.isConfirmed) {
        this.produtoService.delete(id).subscribe({
          next: () => this.loadProdutos(),
          error: () => Swal.fire('Erro', 'Não foi possível excluir o produto.', 'error'),
        });
      }
    });
  }
}
