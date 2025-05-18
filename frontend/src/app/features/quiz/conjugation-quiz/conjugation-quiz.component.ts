import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ConjugationService, ConjugationQuestion } from "./conjugation.service";
import { AuthService } from "../../../core/services/auth.service";
import { ScoreStore } from "../../../core/store/score.store";
import { Subscription } from "rxjs";

interface ReviewAnswer {
  question: ConjugationQuestion;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

@Component({
  selector: "app-conjugation-quiz",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./conjugation-quiz.component.html",
  styleUrls: ["./conjugation-quiz.component.css"],
})
export class ConjugationQuizComponent implements OnInit, OnDestroy {
  questions: ConjugationQuestion[] = [];
  currentQuestionIndex = 0;
  startTime = 0;
  elapsedTime = 0;
  score = 0;
  isLoading = true;
  error: string | null = null;
  quizStarted = false;
  quizEnded = false;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  userLevel: string = "beginner";
  selectedAnswer: string | null = null;
  shuffledAnswers: string[] = [];
  reviewAnswers: ReviewAnswer[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private conjugationService: ConjugationService,
    private authService: AuthService,
    private scoreStore: ScoreStore,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.user$.subscribe((user) => {
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
      this.conjugationService.getQuestions(this.userLevel).subscribe({
        next: (questions: ConjugationQuestion[]) => {
          this.questions = questions;
          this.isLoading = false;
          this.startQuiz();
          this.prepareAnswers();
        },
        error: (error: Error) => {
          console.error("Error loading questions:", error);
          this.error = "Failed to load questions. Please try again.";
          this.isLoading = false;
        },
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

  prepareAnswers(): void {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.shuffledAnswers = [
      currentQuestion.correctAnswer,
      ...currentQuestion.wrongAnswers,
    ].sort(() => Math.random() - 0.5);
    this.selectedAnswer = null;
  }

  selectAnswer(answer: string): void {
    if (!this.selectedAnswer) {
      this.selectedAnswer = answer;
    }
  }

  submitAnswer(): void {
    if (!this.selectedAnswer) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = this.selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      this.score += currentQuestion.scoreValue;
    }

    this.reviewAnswers.push({
      question: currentQuestion,
      userAnswer: this.selectedAnswer,
      isCorrect,
      timeTaken: this.elapsedTime,
    });

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.prepareAnswers();
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

    const correctAnswers = this.reviewAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const incorrectAnswers = this.reviewAnswers.length - correctAnswers;

    this.scoreStore
      .updateScore(this.score, correctAnswers, incorrectAnswers)
      .subscribe({
        next: () => console.log("Score updated successfully"),
        error: (error: Error) => console.error("Error updating score:", error),
      });
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.reviewAnswers = [];
    this.quizStarted = false;
    this.quizEnded = false;
    this.elapsedTime = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.loadQuestions();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
