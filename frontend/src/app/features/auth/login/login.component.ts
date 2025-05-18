import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  returnUrl: string = "/dashboard";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params["returnUrl"] || "/dashboard";
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          // Redirect handled in auth service based on role
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err?.error?.message ||
            "Login failed. Please check your credentials.";
        },
      });
  }
}
