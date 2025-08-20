import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  profileMessage = '';
  passwordMessage = '';
  showPasswordForm = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.profileForm.patchValue({
          fullName: response.fullName || this.currentUser?.name,
          email: response.email || this.currentUser?.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Fallback to current user data
        this.profileForm.patchValue({
          fullName: this.currentUser?.name,
          email: this.currentUser?.email
        });
        this.isLoading = false;
      }
    });
  }

  onSubmitProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileMessage = '';

      const profileData = {
        fullName: this.profileForm.value.fullName,
        email: this.profileForm.value.email
      };

      this.apiService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.profileMessage = 'Profile updated successfully!';
          
          // Update local user data
          this.authService.updateUserProfile({
            name: this.profileForm.value.fullName,
            email: this.profileForm.value.email
          });
          
          // Update current user reference
          this.currentUser = this.authService.getCurrentUser();
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          
          let errorMessage = 'Failed to update profile. Please try again.';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            // Handle validation errors
            const errors = error.error.errors;
            errorMessage = Object.values(errors).flat().join(', ');
          } else if (error.status === 400) {
            errorMessage = 'Invalid data provided. Please check your input.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
          } else if (error.status === 404) {
            errorMessage = 'Profile not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.profileMessage = errorMessage;
          this.isLoading = false;
        }
      });
    }
  }

  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.passwordMessage = '';

      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword
      };

      this.apiService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.passwordMessage = 'Password changed successfully!';
          this.passwordForm.reset();
          this.showPasswordForm = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error changing password:', error);
          
          let errorMessage = 'Failed to change password. Please try again.';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            // Handle validation errors
            const errors = error.error.errors;
            errorMessage = Object.values(errors).flat().join(', ');
          } else if (error.status === 400) {
            errorMessage = 'Invalid password data. Please check your input.';
          } else if (error.status === 401) {
            errorMessage = 'Current password is incorrect.';
          } else if (error.status === 404) {
            errorMessage = 'User not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.passwordMessage = errorMessage;
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (this.showPasswordForm) {
      this.passwordForm.reset();
      this.passwordMessage = '';
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  getProfileErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getPasswordErrorMessage(field: string): string {
    const control = this.passwordForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
