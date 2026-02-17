import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
})
export class ClienteForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = this.fb.group({
    razaoSocial: ['', Validators.required],
    cnpj: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  isEditing = false;
  clienteId = '';
  loading = false;
  loadingCnpj = false;
  errorMessage = '';

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.params['id'] ?? '';
    if (this.clienteId) {
      this.isEditing = true;
      this.clienteService.getById(this.clienteId).subscribe({
        next: (cliente) => this.form.patchValue(cliente),
        error: () => this.router.navigate(['/clientes']),
      });
    }
  }

  consultarCnpj(): void {
    const cnpj = this.form.get('cnpj')?.value;
    if (!cnpj) return;
    this.loadingCnpj = true;
    this.clienteService.consultaCnpj(cnpj).subscribe({
      next: (data) => {
        this.form.patchValue({
          razaoSocial: data.razaoSocial,
          email: data.email ?? '',
          cnpj: data.cnpj,
        });
        this.loadingCnpj = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'CNPJ não encontrado.';
        this.loadingCnpj = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const data = this.form.value as { razaoSocial: string; cnpj: string; email: string };
    const action = this.isEditing
      ? this.clienteService.update(this.clienteId, data)
      : this.clienteService.create(data);

    action.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao salvar cliente.';
        this.loading = false;
      },
    });
  }
}
