import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ProfileService } from "./profile.service";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: string;
  // role supprimé du modèle d’affichage
}

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userProfile: UserProfile | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      email: [{ value: "", disabled: true }],
      level: [{ value: "", disabled: true }],
      password: ["", Validators.minLength(6)], // ⬅️  nouveau champ
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  /* ──────────────────────────────────────────────────────────────────── */

  private loadProfile() {
    this.isLoading = true;
    this.errorMessage = null;

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          level: profile.level,
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load profile. Please try again.";
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.userProfile) return;

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { name, password } = this.profileForm.value;

    // Construit l’objet à envoyer ; ajoute le mot de passe uniquement s’il est renseigné
    const updatedProfile: any = { ...this.userProfile, name };
    if (password) updatedProfile.password = password;

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.get("password")?.reset(); // vide le champ mot de passe
        this.successMessage = "Profile updated successfully";
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to update profile. Please try again.";
        this.isLoading = false;
      },
    });
  }

  /* ──────────────────────────────────────────────────────────────────── */

  getLevelClass(level: string): string {
    switch (level.toUpperCase()) {
      case "BEGINNER":
        return "bg-blue-100 text-blue-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
