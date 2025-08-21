import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  isLoading = false;
  showForm = false;
  editingCategory: any = null;

  categoryForm: FormGroup;

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  showEditForm(category: any) {
    this.editingCategory = category;
    this.showForm = true;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  cancelForm() {
    this.showForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      if (this.editingCategory) {
        this.apiService.updateCategory(this.editingCategory.id, categoryData).subscribe({
          next: () => {
            this.snackBar.open('Category updated successfully!', 'Close', { duration: 3000 });
            this.loadCategories();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.snackBar.open('Failed to update category', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.apiService.createCategory(categoryData).subscribe({
          next: () => {
            this.snackBar.open('Category created successfully!', 'Close', { duration: 3000 });
            this.loadCategories();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.snackBar.open('Failed to create category', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully!', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.snackBar.open('Failed to delete category', 'Close', { duration: 3000 });
        }
      });
    }
  }
}


