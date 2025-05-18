import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent {
  currentYear = new Date().getFullYear();
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  navigateToActions() {
    if (this.isLoggedIn) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.router.navigate(["/auth/register"]);
    }
  }

  navigateToSignup() {
    if (this.isLoggedIn) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.router.navigate(["/auth/register"]);
    }
  }
}
