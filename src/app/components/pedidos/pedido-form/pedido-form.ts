import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../../../models/cliente.model';
import { Produto } from '../../../models/produto.model';
import { ClienteService } from '../../../services/cliente.service';
import { ProdutoService } from '../../../services/produto.service';
import { PedidoService } from '../../../services/pedido.service';

interface OrderItem {
  produtoId: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-pedido-form',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './pedido-form.html',
})
export class PedidoForm implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly produtoService = inject(ProdutoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  itens: OrderItem[] = [];

  selectedClienteId = '';
  selectedProdutoId = '';
  selectedQuantidade = 1;

  loadingData = true;
  loading = false;
  errorMessage = '';

  get total(): number {
    return this.itens.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get canSubmit(): boolean {
    return !!this.selectedClienteId && this.itens.length > 0;
  }

  ngOnInit(): void {
    forkJoin([
      this.clienteService.list(1, 1000),
      this.produtoService.list(1, 1000),
    ]).subscribe({
      next: ([c, p]) => {
        this.clientes = c.data;
        this.produtos = p.data;
        this.loadingData = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar dados. Tente novamente.';
        this.loadingData = false;
      },
    });
  }

  addItem(): void {
    if (!this.selectedProdutoId || this.selectedQuantidade < 1) return;
    const produto = this.produtos.find((p) => p.id === this.selectedProdutoId);
    if (!produto) return;

    const existing = this.itens.find((i) => i.produtoId === this.selectedProdutoId);
    const currentQty = existing ? existing.quantidade : 0;
    const totalQty = currentQty + this.selectedQuantidade;

    if (totalQty > produto.estoque) {
      Swal.fire(
        'Estoque insuficiente',
        `Disponível: ${produto.estoque}. No pedido: ${currentQty}. Tentando adicionar: ${this.selectedQuantidade}.`,
        'warning',
      );
      return;
    }

    if (existing) {
      existing.quantidade = totalQty;
      existing.subtotal = existing.quantidade * existing.precoUnitario;
    } else {
      this.itens.push({
        produtoId: produto.id,
        descricao: produto.descricao,
        quantidade: this.selectedQuantidade,
        precoUnitario: produto.valorVenda,
        subtotal: this.selectedQuantidade * produto.valorVenda,
      });
    }

    this.selectedProdutoId = '';
    this.selectedQuantidade = 1;
  }

  removeItem(produtoId: string): void {
    this.itens = this.itens.filter((i) => i.produtoId !== produtoId);
  }

  onSubmit(): void {
    if (!this.canSubmit) return;
    this.loading = true;
    this.errorMessage = '';

    this.pedidoService
      .create({
        clienteId: this.selectedClienteId,
        itens: this.itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      })
      .subscribe({
        next: () => {
          Swal.fire('Pedido criado!', 'O pedido foi registrado com sucesso.', 'success').then(() =>
            this.router.navigate(['/pedidos']),
          );
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao criar pedido.';
          this.loading = false;
        },
      });
  }
}
