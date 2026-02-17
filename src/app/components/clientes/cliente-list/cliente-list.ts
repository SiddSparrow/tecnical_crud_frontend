import { Component, inject, OnInit } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, SlicePipe],
  templateUrl: './cliente-list.html',
})
export class ClienteList implements OnInit {
  private readonly clienteService = inject(ClienteService);

  clientes: Cliente[] = [];
  page = 1;
  totalPages = 1;
  limit = 10;
  loading = false;

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.list(this.page, this.limit).subscribe({
      next: (res) => {
        this.clientes = res.data;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadClientes();
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Excluir cliente?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, excluir',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(id).subscribe({
          next: () => this.loadClientes(),
          error: () =>
            Swal.fire('Erro', 'Não foi possível excluir o cliente.', 'error'),
        });
      }
    });
  }
}
