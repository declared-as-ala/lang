import { Routes } from '@angular/router';

export const QUIZ_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./quiz-home/quiz-home.component').then(m => m.QuizHomeComponent)
  },
  {
    path: 'challenge',
    loadComponent: () => import('./challenge-quiz/challenge-quiz.component').then(m => m.ChallengeQuizComponent)
  },
  {
    path: 'conjugation',
    loadComponent: () => import('./conjugation-quiz/conjugation-quiz.component').then(m => m.ConjugationQuizComponent)
  },
  {
    path: 'custom',
    loadComponent: () => import('./custom-quiz/custom-quiz.component').then(m => m.CustomQuizComponent)
  },
  {
    path: 'dictation',
    loadComponent: () => import('./dictation-quiz/dictation-quiz.component').then(m => m.DictationQuizComponent)
  },
  {
    path: 'flashcard',
    loadComponent: () => import('./flashcard-quiz/flashcard-quiz.component').then(m => m.FlashcardQuizComponent)
  },
  {
    path: 'sentence',
    loadComponent: () => import('./sentence-quiz/sentence-quiz.component').then(m => m.SentenceQuizComponent)
  },
  {
    path: 'synonym',
    loadComponent: () => import('./synonym-quiz/synonym-quiz.component').then(m => m.SynonymQuizComponent)
  },
  {
    path: 'word-hunt',
    loadComponent: () => import('./word-hunt-quiz/word-hunt-quiz.component').then(m => m.WordHuntQuizComponent)
  },
  {
    path: 'fill-blank',
    loadComponent: () => import('./fill-blank-quiz/fill-blank-quiz.component').then(m => m.FillBlankQuizComponent)
  }
];