import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sentence-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="sentence-quiz-container animate-fade-in">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-primary-600">Sentence Quiz</h2>
        <a [routerLink]="['/dashboard/quiz']" class="text-primary-600 hover:text-primary-700">
          &larr; Back to Quizzes
        </a>
      </div>
      
      <div class="card">
        <p class="text-gray-600">Sentence quiz content coming soon...</p>
      </div>
    </div>
  `,
  styles: []
})
export class SentenceQuizComponent {}