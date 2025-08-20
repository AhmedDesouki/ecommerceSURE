import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.error = null;

    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        this.isLoading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  onCategoryClick(categoryId: number) {
    this.router.navigate(['/products', categoryId]);
  }

  retryLoad() {
    this.loadCategories();
  }

  getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();

    if (name.includes('electronics') || name.includes('device') || name.includes('gadget')) {
      return 'devices';
    } else if (name.includes('clothing') || name.includes('apparel') || name.includes('fashion')) {
      return 'checkroom';
    } else if (name.includes('book') || name.includes('literature') || name.includes('education')) {
      return 'book';
    } else if (name.includes('home') || name.includes('garden') || name.includes('kitchen')) {
      return 'home';
    } else if (name.includes('sport') || name.includes('fitness') || name.includes('outdoor')) {
      return 'sports_soccer';
    } else if (name.includes('beauty') || name.includes('cosmetic') || name.includes('personal')) {
      return 'face';
    } else if (name.includes('toy') || name.includes('game') || name.includes('entertainment')) {
      return 'toys';
    } else if (name.includes('automotive') || name.includes('car') || name.includes('vehicle')) {
      return 'directions_car';
    } else if (name.includes('health') || name.includes('medical') || name.includes('pharmacy')) {
      return 'local_pharmacy';
    } else if (name.includes('food') || name.includes('beverage') || name.includes('grocery')) {
      return 'restaurant';
    } else {
      return 'category';
    }
  }

  getCategoryIconClass(categoryName: string): string {
    const name = categoryName.toLowerCase();

    if (name.includes('electronics') || name.includes('device') || name.includes('gadget')) {
      return 'icon-electronics';
    } else if (name.includes('clothing') || name.includes('apparel') || name.includes('fashion')) {
      return 'icon-clothing';
    } else if (name.includes('book') || name.includes('literature') || name.includes('education')) {
      return 'icon-books';
    } else if (name.includes('home') || name.includes('garden') || name.includes('kitchen')) {
      return 'icon-home';
    } else if (name.includes('sport') || name.includes('fitness') || name.includes('outdoor')) {
      return 'icon-sports';
    } else if (name.includes('beauty') || name.includes('cosmetic') || name.includes('personal')) {
      return 'icon-beauty';
    } else if (name.includes('toy') || name.includes('game') || name.includes('entertainment')) {
      return 'icon-toys';
    } else if (name.includes('automotive') || name.includes('car') || name.includes('vehicle')) {
      return 'icon-automotive';
    } else if (name.includes('health') || name.includes('medical') || name.includes('pharmacy')) {
      return 'icon-health';
    } else if (name.includes('food') || name.includes('beverage') || name.includes('grocery')) {
      return 'icon-food';
    } else {
      return 'icon-default';
    }
  }
}
