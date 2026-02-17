import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly userName = this.authService.getUser()?.nome ?? '';

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
