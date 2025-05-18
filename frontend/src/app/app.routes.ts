// src/app/app.routes.ts
import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { adminGuard } from "./core/guards/admin.guard";

export const APP_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/landing/landing.component").then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.routes").then((r) => r.AUTH_ROUTES),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./features/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "translate",
        pathMatch: "full",
      },
      {
        path: "translate",
        loadComponent: () =>
          import("./features/translate/translate.component").then(
            (m) => m.TranslateComponent
          ),
      },
      {
        path: "chat",
        loadComponent: () =>
          import("./features/chat/chat.component").then((m) => m.ChatComponent),
      },
      {
        path: "quiz",
        loadChildren: () =>
          import("./features/quiz/quiz.routes").then((r) => r.QUIZ_ROUTES),
      },
    ],
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./features/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/admin/dashboard/admin-dashboard.component").then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./features/admin/users/user-list.component").then(
            (m) => m.UserComponent
          ),
      },
      {
        path: "flashcards",
        loadComponent: () =>
          import("./features/admin/flashcard/flashcard.component").then(
            (m) => m.FlashcardComponent
          ),
      },
      {
        path: "fill-blanks",
        loadComponent: () =>
          import("./features/admin/fillblank/fillblank.component").then(
            (m) => m.FillBlankComponent
          ),
      },
      {
        path: "synonyms",
        loadComponent: () =>
          import("./features/admin/synant/synant.component").then(
            (m) => m.SynAntComponent
          ),
      },

      {
        path: "conjugations",
        loadComponent: () =>
          import("./features/admin/conjugation/conjugation.component").then(
            (m) => m.ConjugaisonComponent
          ),
      },
      {
        path: "synant",
        loadComponent: () =>
          import("./features/admin/synant/synant.component").then(
            (m) => m.SynAntComponent
          ),
      },
      {
        path: "fillblank",
        loadComponent: () =>
          import("./features/admin/fillblank/fillblank.component").then(
            (m) => m.FillBlankComponent
          ),
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./shared/components/not-found/not-found.component").then(
        (m) => m.NotFoundComponent
      ),
  },
];
