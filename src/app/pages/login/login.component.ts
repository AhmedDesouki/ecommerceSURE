import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';

      const credentials: LoginCredentials = this.loginForm.value;

      // Try real API first, fallback to demo login
      this.apiService.login(credentials).subscribe({
        next: (response) => {
          this.authService.setAuthData(response);
          // Updated to use the mapped name property
          this.snackBar.open(`Login successful! Welcome ${response.user.fullName}`, 'Close', { duration: 3000 });
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('API login failed, using demo login:', err);
          // Fallback to demo login for testing
          this.demoLogin(credentials.email);
        }
      });
    } else {
      this.error = 'Please fill in all fields correctly';
    }
  }

  private demoLogin(email: string): void {
    // Determine role based on email for demo purposes
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    
    if (role === 'admin') {
      this.authService.demoLoginAsAdmin();
    } else {
      this.authService.demoLoginAsUser();
    }
    
    this.snackBar.open(`Demo login successful as ${role}!`, 'Close', { duration: 3000 });
    this.isLoading = false;
  }

  // Quick demo login buttons
  loginAsAdmin(): void {
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'admin123'
    });
    this.onSubmit();
  }

  loginAsUser(): void {
    this.loginForm.patchValue({
      email: 'user@example.com',
      password: 'user123'
    });
    this.onSubmit();
  }
}