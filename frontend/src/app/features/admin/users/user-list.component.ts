import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService, User } from "./user.service";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-list.component.html",
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  paged: User[] = [];

  searchTerm = "";
  isLoading = false;

  // pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  // modals & forms
  showForm = false;
  formMode: "create" | "edit" = "create";
  formModel: Partial<User> = {};
  showDeleteConfirm = false;
  deleteTarget: User | null = null;

  // toasts
  toasts: Toast[] = [];
  private nextToastId = 0;

  constructor(private svc: UserService) {}

  ngOnInit() {
    this.load();
  }

  private refreshPagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    this.paged = this.filtered.slice(start, start + this.pageSize);
  }

  load() {
    this.isLoading = true;
    this.svc.getAll().subscribe({
      next: (list) => {
        this.users = list;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast("error", "Failed to load users");
      },
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filtered = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.refreshPagination();
  }

  goToPage(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
    this.refreshPagination();
  }
  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  openCreate() {
    this.formMode = "create";
    this.formModel = {
      name: "",
      email: "",
      password: "",
      role: null,
      score: 0,
      level: "BEGINNER",
    };
    this.showForm = true;
  }

  openEdit(u: User) {
    this.formMode = "edit";
    this.formModel = { ...u };
    this.showForm = true;
  }

  save() {
    const op =
      this.formMode === "create"
        ? this.svc.create(this.formModel)
        : this.svc.update((this.formModel as User).id, this.formModel);

    op.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
        this.toast(
          "success",
          `User ${this.formMode === "create" ? "created" : "updated"}`
        );
      },
      error: () => {
        this.toast(
          "error",
          `Failed to ${this.formMode === "create" ? "create" : "update"} user`
        );
      },
    });
  }

  cancelForm() {
    this.showForm = false;
  }

  confirmDelete(u: User) {
    this.deleteTarget = u;
    this.showDeleteConfirm = true;
  }

  delete() {
    if (!this.deleteTarget) return;
    this.svc.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.load();
        this.toast("success", "User deleted");
      },
      error: () => {
        this.toast("error", "Failed to delete user");
      },
    });
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  // Toast logic
  private toast(type: "success" | "error", message: string) {
    const id = this.nextToastId++;
    this.toasts.push({ id, type, message });
    setTimeout(
      () => (this.toasts = this.toasts.filter((t) => t.id !== id)),
      3000
    );
  }
}
