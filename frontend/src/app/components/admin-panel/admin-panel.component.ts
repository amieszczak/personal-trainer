import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(AuthService);

  loginForm: FormGroup;
  loginError = false;
  errorMessage = '';
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = false;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (!response.success) {
            this.loginError = true;
            this.errorMessage = response.message;
            this.loginForm.patchValue({ password: '' });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = true;
          this.errorMessage = 'An error occurred. Please try again.';
          console.error('Login error:', error);
          this.loginForm.patchValue({ password: '' });
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.loginForm.reset();
    this.loginError = false;
    this.errorMessage = '';
  }

  navigateToTransformations(): void {
    this.router.navigate(['/admin-panel/transformations']);
  }
}
