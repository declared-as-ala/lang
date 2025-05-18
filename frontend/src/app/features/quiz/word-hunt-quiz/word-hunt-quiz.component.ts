import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-word-hunt-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="word-hunt-quiz-container animate-fade-in">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-primary-600">Word Hunt Quiz</h2>
        <a [routerLink]="['/dashboard/quiz']" class="text-primary-600 hover:text-primary-700">
          &larr; Back to Quizzes
        </a>
      </div>
      
      <div class="card">
        <p class="text-gray-600">Word hunt quiz content coming soon...</p>
      </div>
    </div>
  `,
  styles: []
})
export class WordHuntQuizComponent {}