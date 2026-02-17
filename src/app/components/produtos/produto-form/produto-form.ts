import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ProdutoImagem } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.html',
})
export class ProdutoForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = this.fb.group({
    descricao: ['', Validators.required],
    valorVenda: [null as number | null, [Validators.required, Validators.min(0)]],
    estoque: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  isEditing = false;
  produtoId = '';
  existingImages: ProdutoImagem[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.produtoId = this.route.snapshot.params['id'] ?? '';
    if (this.produtoId) {
      this.isEditing = true;
      this.produtoService.getById(this.produtoId).subscribe({
        next: (produto) => {
          this.form.patchValue(produto);
          this.existingImages = produto.imagens ?? [];
        },
        error: () => this.router.navigate(['/produtos']),
      });
    }
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const maxFiles = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files.length > maxFiles) {
      Swal.fire('Limite excedido', `Selecione no máximo ${maxFiles} arquivos.`, 'warning');
      input.value = '';
      return;
    }

    const oversized = files.filter((f) => f.size > maxSize);
    if (oversized.length > 0) {
      const names = oversized.map((f) => f.name).join(', ');
      Swal.fire('Arquivo muito grande', `Máximo 5MB por arquivo. Excedidos: ${names}`, 'warning');
      input.value = '';
      return;
    }

    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.selectedFiles = files;
    this.previewUrls = files.map((f) => URL.createObjectURL(f));
  }

  removeSelectedFile(index: number): void {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  deleteExistingImage(imagemId: string): void {
    Swal.fire({
      title: 'Excluir imagem?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, excluir',
    }).then((result) => {
      if (result.isConfirmed) {
        this.produtoService.deleteImage(this.produtoId, imagemId).subscribe({
          next: () => {
            this.existingImages = this.existingImages.filter((img) => img.id !== imagemId);
          },
          error: () => Swal.fire('Erro', 'Não foi possível excluir a imagem.', 'error'),
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const data = {
      descricao: this.form.value.descricao!,
      valorVenda: Number(this.form.value.valorVenda),
      estoque: Number(this.form.value.estoque),
    };

    const save$ = this.isEditing
      ? this.produtoService.update(this.produtoId, data)
      : this.produtoService.create(data);

    save$
      .pipe(
        switchMap((produto) => {
          if (this.selectedFiles.length > 0) {
            return this.produtoService.uploadImages(produto.id, this.selectedFiles);
          }
          return of(produto);
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/produtos']),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao salvar produto.';
          this.loading = false;
        },
      });
  }
}
