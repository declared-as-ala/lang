import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, take } from "rxjs/operators";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user?.roles.includes("ADMIN")) {
        return true;
      } else {
        router.navigate(["/dashboard"]);
        return false;
      }
    })
  );
};
