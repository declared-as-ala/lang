import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SynonymQuizService } from "./synonym-quiz.service";
import type { SynonymQuestion } from "./synonym-quiz.service";
import { AuthService } from "../../../core/services/auth.service";
import { ScoreStore } from "../../../core/store/score.store";
import { Subscription } from "rxjs";

interface ReviewAnswer {
  question: SynonymQuestion;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

@Component({
  selector: "app-synonym-quiz",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./synonym-quiz.component.html",
  styleUrls: ["./synonym-quiz.component.css"],
})
export class SynonymQuizComponent implements OnInit, OnDestroy {
  questions: SynonymQuestion[] = [];
  currentQuestionIndex = 0;
  startTime = 0;
  elapsedTime = 0;
  correctAnswers = 0;
  isLoading = true;
  error: string | null = null;
  quizStarted = false;
  quizEnded = false;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  userLevel: string = "beginner";
  answerForm: FormGroup;
  reviewAnswers: ReviewAnswer[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private synonymService: SynonymQuizService,
    private authService: AuthService,
    private scoreStore: ScoreStore,
    private fb: FormBuilder
  ) {
    this.answerForm = this.fb.group({
      answer: ["", Validators.required],
    });
  }

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
      this.synonymService.getRandomQuestions(this.userLevel, 10).subscribe({
        next: (questions: SynonymQuestion[]) => {
          this.questions = questions;
          this.isLoading = false;
          this.startQuiz();
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

  submitAnswer(): void {
    if (this.answerForm.invalid) return;

    const userAnswer = this.answerForm.value.answer.toLowerCase().trim();
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const correctSynonym = currentQuestion.synonymGerman.toLowerCase().trim();
    const correctAntonym = currentQuestion.antonymGerman.toLowerCase().trim();
    const isCorrect =
      userAnswer === correctSynonym || userAnswer === correctAntonym;

    if (isCorrect) {
      this.correctAnswers++;
    }

    this.reviewAnswers.push({
      question: currentQuestion,
      userAnswer,
      isCorrect,
      timeTaken: this.elapsedTime,
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

    const incorrectAnswers = this.questions.length - this.correctAnswers;

    this.scoreStore
      .updateScore(this.correctAnswers, this.correctAnswers, incorrectAnswers)
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
    this.correctAnswers = 0;
    this.answerForm.reset();
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
