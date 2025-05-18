import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { DashboardSidebarComponent } from "./dashboard-sidebar/dashboard-sidebar.component";
import { AuthService } from "../../core/services/auth.service";
import { ScoreStore, ScoreState } from "../../core/store/score.store";
import { User } from "../../core/models/user.model";
import { Subscription, filter } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardSidebarComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  scoreState: ScoreState = {
    currentScore: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastUpdated: new Date(),
  };
  accuracy = 0;
  isQuizRoute = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private scoreStore: ScoreStore,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to user updates
    this.subscriptions.push(
      this.authService.user$.subscribe((user) => {
        this.currentUser = user;
      })
    );

    // Subscribe to score state updates
    this.subscriptions.push(
      this.scoreStore.state$.subscribe((state) => {
        this.scoreState = state;
        this.accuracy = this.calculateAccuracy();
      })
    );

    // Subscribe to route changes
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.isQuizRoute = event.url.includes("/quiz");
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private calculateAccuracy(): number {
    const total =
      this.scoreState.correctAnswers + this.scoreState.incorrectAnswers;
    return total > 0 ? (this.scoreState.correctAnswers / total) * 100 : 0;
  }
}
