import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthService } from "./core/services/auth.service";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgClass],
  template: `
    <div
      class="min-h-screen flex flex-col bg-gray-50 pt-16"
      [ngClass]="{ 'authenticated-layout': isLoggedIn }"
    >
      <app-navbar></app-navbar>

      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .authenticated-layout {
        background-color: #f9f9f9;
      }
    `,
  ],
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(
      (isAuth) => (this.isLoggedIn = isAuth)
    );
  }
}
