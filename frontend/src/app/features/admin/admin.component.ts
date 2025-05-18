import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./admin.component.html",
})
export class AdminComponent {
  // sidebar always visible—no toggle needed
}
