import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.Register),
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./components/clientes/cliente-list/cliente-list').then((m) => m.ClienteList),
        canActivate: [adminGuard],
      },
      {
        path: 'clientes/novo',
        loadComponent: () =>
          import('./components/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
        canActivate: [adminGuard],
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () =>
          import('./components/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
        canActivate: [adminGuard],
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./components/produtos/produto-list/produto-list').then((m) => m.ProdutoList),
      },
      {
        path: 'produtos/novo',
        loadComponent: () =>
          import('./components/produtos/produto-form/produto-form').then((m) => m.ProdutoForm),
        canActivate: [adminGuard],
      },
      {
        path: 'produtos/:id/editar',
        loadComponent: () =>
          import('./components/produtos/produto-form/produto-form').then((m) => m.ProdutoForm),
        canActivate: [adminGuard],
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./components/pedidos/pedido-list/pedido-list').then((m) => m.PedidoList),
      },
      {
        path: 'pedidos/novo',
        loadComponent: () =>
          import('./components/pedidos/pedido-form/pedido-form').then((m) => m.PedidoForm),
      },
    ],
  },
  { path: '**', redirectTo: 'produtos' },
];
