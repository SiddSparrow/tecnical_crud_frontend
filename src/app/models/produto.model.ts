export interface ProdutoImagem {
  id: string;
  produtoId: string;
  filename: string;
  path: string;
  createdAt: string;
}

export interface Produto {
  id: string;
  descricao: string;
  valorVenda: number;
  estoque: number;
  imagens: ProdutoImagem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProdutoDto {
  descricao: string;
  valorVenda: number;
  estoque: number;
}

export interface UpdateProdutoDto {
  descricao?: string;
  valorVenda?: number;
  estoque?: number;
}
