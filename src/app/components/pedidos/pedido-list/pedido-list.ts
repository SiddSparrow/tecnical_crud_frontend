import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pedido-list',
  imports: [RouterLink, CurrencyPipe, DatePipe, SlicePipe],
  templateUrl: './pedido-list.html',
})
export class PedidoList implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  protected readonly authService = inject(AuthService);

  pedidos: Pedido[] = [];
  page = 1;
  totalPages = 1;
  pageNumbers: number[] = [1];
  limit = 10;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.pedidoService.list(this.page, this.limit).subscribe({
      next: (res) => {
        this.pedidos = res.data;
        this.totalPages = res.totalPages;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar pedidos.';
        this.loading = false;
      },
    });
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadPedidos();
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Excluir pedido?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, excluir',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.delete(id).subscribe({
          next: () => this.loadPedidos(),
          error: () => Swal.fire('Erro', 'Não foi possível excluir o pedido.', 'error'),
        });
      }
    });
  }
}
