import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-quiz-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold text-primary-600 mb-6">Quiz Dashboard</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let quiz of quizTypes"
          class="card hover:shadow-lg transition-all duration-200 bg-white rounded-lg p-6"
        >
          <a [routerLink]="[quiz.route]" class="block h-full">
            <div class="text-primary-500 mb-4 text-4xl">{{ quiz.icon }}</div>
            <h3 class="text-xl font-semibold text-primary-700 mb-2">
              {{ quiz.name }}
            </h3>
            <p class="text-gray-600">{{ quiz.description }}</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class QuizHomeComponent {
  quizTypes = [
    {
      name: "Flashcards",
      description: "Learn vocabulary with interactive flashcards",
      icon: "🎴",
      route: "/dashboard/quiz/flashcard",
    },
    {
      name: "60-Second Challenge",
      description: "Test your German skills against the clock",
      icon: "⏱️",
      route: "/dashboard/quiz/challenge",
    },
    {
      name: "Synonyms & Antonyms",
      description: "Practice with word relationships",
      icon: "🔄",
      route: "/dashboard/quiz/synonym",
    },
    {
      name: "Fill in the Blanks",
      description: "Complete sentences with missing words",
      icon: "✍️",
      route: "/dashboard/quiz/fill-blank",
    },
    {
      name: "Conjugation",
      description: "Practice verb conjugations",
      icon: "📝",
      route: "/dashboard/quiz/conjugation",
    },
  ];
}
