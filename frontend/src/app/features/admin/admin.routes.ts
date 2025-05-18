import { Routes } from "@angular/router";
import { adminGuard } from "../../core/guards/admin.guard";

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./admin.component").then((m) => m.AdminComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./dashboard/admin-dashboard.component").then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./users/user-list.component").then((m) => m.UserComponent),
      },
      // ... you can add more admin sub‐routes here
    ],
  },
];
