import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { FlashcardService, FlashCard } from "./flashcard.service";
import { ScoreStore } from "../../../core/store/score.store";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-flashcard-quiz",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./flashcard-quiz.component.html",
  styleUrls: ["./flashcard-quiz.component.css"],
})
export class FlashcardQuizComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  @ViewChild("chatContainer") private chatContainer!: ElementRef;
  /** ⬇️  nouvelle référence pour remettre le focus sur l’input */
  @ViewChild("answerInput") private answerInput!: ElementRef<HTMLInputElement>;

  currentIndex = 0;
  isFlipped = false;
  isCorrect = false;
  isIncorrect = false;
  userAnswer = "";
  reviewMode = false;
  isLoading = true;
  error: string | null = null;
  userLevel = "";
  score = 0;
  timer = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;

  words: FlashCard[] = [];
  private subscriptions: Subscription[] = [];
  private correctSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
  );
  private incorrectSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3"
  );

  reviewedCards: {
    word: FlashCard;
    wasCorrect: boolean;
    userAnswer: string;
  }[] = [];

  constructor(
    private authService: AuthService,
    private flashcardService: FlashcardService,
    private scoreStore: ScoreStore
  ) {}

  /* ────────────────────────────────────────────────────────────────────── */
  /*                         LIFE-CYCLE HOOKS                              */
  /* ────────────────────────────────────────────────────────────────────── */

  ngOnInit() {
    this.startTimer();

    this.subscriptions.push(
      this.authService.user$.subscribe((user) => {
        if (user) {
          this.userLevel = user.level;
          this.loadFlashcards(user.level);
        }
      }),
      this.scoreStore.score$.subscribe((s) => (this.score = s))
    );
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /* ────────────────────────────────────────────────────────────────────── */
  /*                              QUIZ FLOW                                */
  /* ────────────────────────────────────────────────────────────────────── */

  retryLoading() {
    const user = this.authService.getCurrentUser();
    user ? this.loadFlashcards(user.level) : (this.error = "User not found.");
  }

  private loadFlashcards(level: string) {
    this.isLoading = true;
    this.error = null;

    this.flashcardService.getFlashcards(level).subscribe({
      next: (cards) => {
        if (cards?.length) {
          this.words = cards;
          this.error = null;
          this.focusInput();
        } else {
          this.error = "No flashcards available for your level.";
          this.words = [];
        }
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.error = "Failed to load flashcards. Please try again.";
        this.words = [];
        this.isLoading = false;
      },
    });
  }

  checkAnswer() {
    const card = this.words[this.currentIndex];
    if (!card) return;

    const correctAnswer = `${card.article} ${card.german}`.toLowerCase().trim();
    const userInput = this.userAnswer.toLowerCase().trim();

    if (userInput === correctAnswer) {
      /* -------- Réponse correcte -------- */
      this.isCorrect = true;
      this.isIncorrect = false;
      this.score += card.score;
      this.correctAnswers++;
      this.correctSound.play();

      this.scoreStore.updateScore(this.score, 1, 0).subscribe();

      /* ➡️  Passage automatique à la carte suivante (sauf dernière) */
      if (this.currentIndex < this.words.length - 1) {
        setTimeout(() => this.nextCard(), 800); // petit délai pour le feedback
      }
    } else {
      /* -------- Réponse incorrecte -------- */
      this.isCorrect = false;
      this.isIncorrect = true;
      this.incorrectAnswers++;
      this.incorrectSound.play();
    }

    /* Ajout au tableau de révision */
    this.reviewedCards.push({
      word: card,
      wasCorrect: this.isCorrect,
      userAnswer: this.userAnswer,
    });

    /* Si c’était la dernière carte, active Review Mode */
    if (this.currentIndex === this.words.length - 1) {
      this.reviewMode = true;
      this.scoreStore
        .updateScore(this.score, this.correctAnswers, this.incorrectAnswers)
        .subscribe();
    }

    /* Nettoyage après 1,5 s */
    setTimeout(() => {
      this.isCorrect = false;
      this.isIncorrect = false;
      this.userAnswer = "";
      this.isFlipped = false;
      this.focusInput();
    }, 1500);
  }

  /* ────────────────────────────────────────────────────────────────────── */

  startTimer() {
    const timerSub = interval(1000).subscribe(() => this.timer++);
    this.subscriptions.push(timerSub);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${s}`;
  }

  flipCard() {
    if (!this.words.length) return;
    this.isFlipped = !this.isFlipped;
    if (this.isFlipped) setTimeout(() => (this.isFlipped = false), 1000);
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.resetState();
    }
  }

  nextCard() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.resetState();
    }
  }

  resetState() {
    this.isFlipped = false;
    this.isCorrect = false;
    this.isIncorrect = false;
    this.userAnswer = "";
    this.focusInput();
  }

  /* ────────────────────────────────────────────────────────────────────── */
  /*                              HELPERS                                  */
  /* ────────────────────────────────────────────────────────────────────── */

  /** Remet le focus sur l’input réponse si présent */
  private focusInput() {
    setTimeout(() => this.answerInput?.nativeElement.focus(), 0);
  }

  private scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch {
      /* ignore */
    }
  }
}
