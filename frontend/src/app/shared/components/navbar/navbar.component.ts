import { Component, OnInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { User } from "../../../core/models/user.model";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isDropdownOpen = false;
  currentUser: User | null = null;
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = user?.roles.includes("ADMIN") || false;
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const dropdown = document.querySelector(".nav-dropdown");
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  navigateToHome() {
    this.router.navigate(["/"]);
    this.closeDropdown();
  }

  navigateToAbout() {
    // TODO: Implement about page navigation
    console.log("Navigate to about page");
    this.closeDropdown();
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
    this.closeDropdown();
  }

  navigateToSignup() {
    this.router.navigate(["/auth/register"]);
    this.closeDropdown();
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
  }
}
