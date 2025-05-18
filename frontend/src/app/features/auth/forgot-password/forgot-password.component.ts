import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const email = this.forgotPasswordForm.value.email;
    
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password reset instructions have been sent to your email.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.message || 'Failed to send password reset email. Please try again.';
      }
    });
  }
}