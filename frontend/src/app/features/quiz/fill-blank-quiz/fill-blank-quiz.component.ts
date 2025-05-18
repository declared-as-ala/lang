import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FillBlankService, FillBlankQuestion } from './fill-blank.service';
import { AuthService } from '../../../core/services/auth.service';
import { ScoreStore } from '../../../core/store/score.store';
import { Subscription } from 'rxjs';

interface QuestionReview {
  question: FillBlankQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-fill-blank-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './fill-blank-quiz.component.html',
  styleUrls: ['./fill-blank-quiz.component.css']
})
export class FillBlankQuizComponent implements OnInit, OnDestroy {
  questions: FillBlankQuestion[] = [];
  currentQuestionIndex = 0;
  startTime = 0;
  elapsedTime = 0;
  score = 0;
  isLoading = true;
  error: string | null = null;
  quizStarted = false;
  quizEnded = false;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  userLevel: string = 'beginner';
  answerForm: FormGroup;
  reviewAnswers: QuestionReview[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private fillBlankService: FillBlankService,
    private authService: AuthService,
    private scoreStore: ScoreStore,
    private fb: FormBuilder
  ) {
    this.answerForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.user$.subscribe(user => {
        if (user) {
          this.userLevel = user.level;
          this.loadQuestions();
        }
      })
    );
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.error = null;

    this.subscriptions.push(
      this.fillBlankService.getQuestions(this.userLevel).subscribe({
        next: (questions: FillBlankQuestion[]) => {
          this.questions = questions;
          this.isLoading = false;
          this.startQuiz();
        },
        error: (error: Error) => {
          console.error('Error loading questions:', error);
          this.error = 'Failed to load questions. Please try again.';
          this.isLoading = false;
        }
      })
    );
  }

  startQuiz(): void {
    this.quizStarted = true;
    this.startTime = Date.now();
    this.startTimer();
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  submitAnswer(): void {
    if (this.answerForm.invalid) return;

    const userAnswer = this.answerForm.value.answer.toLowerCase().trim();
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswer.toLowerCase().trim();

    if (isCorrect) {
      this.score += 1;
    }

    this.reviewAnswers.push({
      question: currentQuestion,
      userAnswer,
      isCorrect
    });

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.answerForm.reset();
    } else {
      this.endQuiz();
    }
  }

  endQuiz(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.quizEnded = true;

    const correctAnswers = this.reviewAnswers.filter(answer => answer.isCorrect).length;
    const incorrectAnswers = this.reviewAnswers.length - correctAnswers;

    this.scoreStore.updateScore(
      this.score,
      correctAnswers,
      incorrectAnswers
    ).subscribe({
      next: () => console.log('Score updated successfully'),
      error: (error: Error) => console.error('Error updating score:', error)
    });
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.reviewAnswers = [];
    this.quizStarted = false;
    this.quizEnded = false;
    this.elapsedTime = 0;
    this.score = 0;
    this.answerForm.reset();
    this.loadQuestions();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}