import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ChallengeQuizService, ChallengeQuestion } from "./challenge.service";
import { AuthService } from "../../../core/services/auth.service";
import { ScoreStore } from "../../../core/store/score.store";

@Component({
  selector: "app-challenge-quiz",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./challenge-quiz.component.html",
  styleUrls: ["./challenge-quiz.component.css"],
})
export class ChallengeQuizComponent implements OnInit {
  questions: ChallengeQuestion[] = [];
  currentQuestionIndex = 0;
  timeLeft = 60;
  score = 0;
  isLoading = true;
  error: string | null = null;
  quizStarted = false;
  quizEnded = false;
  timerInterval: any;
  userLevel: string = "beginner";
  correctAnswers = 0;

  answerForm: FormGroup;

  constructor(
    private challengeService: ChallengeQuizService,
    private authService: AuthService,
    private scoreStore: ScoreStore,
    private fb: FormBuilder
  ) {
    this.answerForm = this.fb.group({
      answer: ["", Validators.required],
    });
  }

  ngOnInit() {
    // Get initial score
    this.scoreStore.score$.subscribe((currentScore) => {
      this.score = currentScore;
    });

    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userLevel = user.level.toLowerCase();
        this.loadQuestions();
      }
    });
  }

  public loadQuestions() {
    this.isLoading = true;
    this.challengeService.getRandomQuestions(this.userLevel, 10).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading questions:", error);
        this.error = "Failed to load questions. Please try again.";
        this.isLoading = false;
      },
    });
  }

  startQuiz() {
    this.quizStarted = true;
    this.startTimer();
  }

  private startTimer() {
    this.timeLeft = 60;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endQuiz();
      }
    }, 1000);
  }

  submitAnswer() {
    if (this.answerForm.invalid) return;

    const userAnswer = this.answerForm.value.answer.toLowerCase().trim();
    const correctAnswer = this.questions[this.currentQuestionIndex].questionDe
      .toLowerCase()
      .trim();

    if (userAnswer === correctAnswer) {
      // Calculate points based on time left and add to score
      const timeBonus = Math.floor(this.timeLeft / 10); // Bonus points for quick answers
      const questionPoints = 10 + timeBonus; // Base points + time bonus
      this.score += questionPoints;
      this.correctAnswers++;
    }

    // Move to next question
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.answerForm.reset();
    } else {
      this.endQuiz();
    }
  }

  endQuiz() {
    clearInterval(this.timerInterval);
    this.quizEnded = true;

    // Update score in store
    this.scoreStore
      .updateScore(
        this.score,
        this.correctAnswers,
        this.questions.length - this.correctAnswers
      )
      .subscribe({
        next: () => console.log("Score updated successfully"),
        error: (error) => console.error("Error updating score:", error),
      });
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.quizStarted = false;
    this.quizEnded = false;
    this.answerForm.reset();
    this.loadQuestions();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
