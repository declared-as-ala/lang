import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <h1 class="text-9xl font-extrabold text-primary-600">404</h1>
        <h2 class="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p class="mt-2 text-lg text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        <div class="mt-6">
          <a [routerLink]="['/']" class="btn-primary inline-flex">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}