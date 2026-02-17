import { Cliente } from './cliente.model';
import { Produto } from './produto.model';

export interface PedidoItem {
  id: string;
  pedidoId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto: Produto;
}

export interface Pedido {
  id: string;
  clienteId: string;
  cliente: Cliente;
  total: number;
  itens: PedidoItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PedidoItemDto {
  produtoId: string;
  quantidade: number;
}

export interface CreatePedidoDto {
  clienteId: string;
  itens: PedidoItemDto[];
}
