// src/app/features/admin/flashcard/flashcard.component.ts
import {
  Component,
  OnInit,
  Signal,
  signal,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { FlashcardService, FlashcardDTO } from "./flashcard.service";

@Component({
  selector: "app-flashcard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- ✅ Toast -->
    <div
      *ngIf="toast()"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow animate-fade-in z-50"
    >
      {{ toast() }}
    </div>

    <div class="space-y-6 p-4">
      <!-- ✅ Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Flashcards</h2>
        <button class="btn-primary flex items-center gap-1" (click)="openAdd()">
          ➕ Add
        </button>
      </div>

      <!-- ✅ Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead class="bg-primary-600 text-white">
            <tr>
              <th class="th">#</th>
              <th class="th">English</th>
              <th class="th">German</th>
              <th class="th">Article</th>
              <th class="th">Level</th>
              <th class="th">Score</th>
              <th class="th text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of pageData(); let i = index"
              class="border-b last:border-none"
            >
              <td class="td">{{ (currentPage() - 1) * pageSize + i + 1 }}</td>
              <td class="td">{{ item.english }}</td>
              <td class="td">{{ item.german }}</td>
              <td class="td">{{ item.article }}</td>
              <td class="td capitalize">{{ item.level }}</td>
              <td class="td">{{ item.score }}</td>
              <td class="td text-center">
                <div class="flex justify-center gap-2">
                  <button class="icon-btn" (click)="openEdit(item)">✏️</button>
                  <button
                    class="icon-btn bg-red-600 hover:bg-red-700"
                    (click)="remove(item.mongoId)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Pagination -->
      <div class="flex justify-center items-center gap-4 mt-4">
        <button
          class="icon-btn"
          [disabled]="currentPage() === 1"
          (click)="prevPage()"
        >
          ←
        </button>
        <span class="font-medium">
          Page {{ currentPage() }} / {{ totalPages() }}
        </span>
        <button
          class="icon-btn"
          [disabled]="currentPage() === totalPages()"
          (click)="nextPage()"
        >
          →
        </button>
      </div>
    </div>

    <!-- ✅ Modal -->
    <div
      *ngIf="showModal()"
      class="fixed inset-0 bg-black/40 flex items-start justify-center z-50"
    >
      <div
        class="bg-white w-full max-w-xl mt-20 rounded-lg shadow-lg p-6 animate-slide-up relative"
      >
        <button
          class="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          (click)="closeModal()"
        >
          ✕
        </button>
        <h3 class="text-xl font-semibold mb-4">
          {{ editing() ? "Edit Flashcard" : "Add Flashcard" }}
        </h3>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              class="input"
              placeholder="English"
              formControlName="english"
            />
            <input
              class="input"
              placeholder="German"
              formControlName="german"
            />
            <select class="input" formControlName="article">
              <option value="" disabled>Article</option>
              <option *ngFor="let a of articles" [value]="a">{{ a }}</option>
            </select>
            <input
              class="input"
              placeholder="Example Sentence"
              formControlName="exampleSentence"
            />
            <select class="input" formControlName="level">
              <option *ngFor="let l of levels" [value]="l">
                {{ l | titlecase }}
              </option>
            </select>
            <input
              type="number"
              class="input"
              placeholder="Score"
              formControlName="score"
            />
          </div>
          <div class="flex gap-2 pt-2">
            <button class="btn-primary" type="submit" [disabled]="form.invalid">
              {{ editing() ? "Update" : "Create" }}
            </button>
            <button class="btn-secondary" type="button" (click)="closeModal()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .input {
        @apply px-3 py-2 border rounded-md w-full;
      }
      .btn-primary {
        @apply px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700;
      }
      .btn-secondary {
        @apply px-4 py-2 rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50;
      }
      .icon-btn {
        @apply px-3 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50;
      }
      .th {
        @apply px-4 py-2 text-left;
      }
      .td {
        @apply px-4 py-2;
      }
    `,
  ],
})
export class FlashcardComponent implements OnInit {
  data = signal<FlashcardDTO[]>([]);
  currentPage = signal(1);
  pageSize = 10;
  showModal = signal(false);
  editing = signal(false);
  toast = signal<string | null>(null);
  private editingId: string | null = null;

  form!: FormGroup;

  articles = ["der", "die", "das"];
  levels = ["easy", "intermediate", "advanced"] as const;

  constructor(private service: FlashcardService, private fb: FormBuilder) {}

  totalPages: Signal<number> = computed(() =>
    Math.max(1, Math.ceil(this.data().length / this.pageSize))
  );

  pageData = computed(() =>
    this.data().slice(
      (this.currentPage() - 1) * this.pageSize,
      this.currentPage() * this.pageSize
    )
  );

  private flash(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 2500);
  }

  ngOnInit() {
    this.load();
    this.form = this.fb.group({
      english: ["", Validators.required],
      german: ["", Validators.required],
      article: ["", Validators.required],
      exampleSentence: ["", Validators.required],
      level: ["easy", Validators.required],
      score: [5, [Validators.required, Validators.min(1)]],
    });

    effect(() => {
      this.currentPage.set(Math.min(this.currentPage(), this.totalPages()));
    });
  }

  load() {
    this.service.getFlashcards().subscribe((res) => this.data.set(res));
  }

  openAdd() {
    this.editing.set(false);
    this.editingId = null;
    this.form.reset({
      english: "",
      german: "",
      article: "",
      exampleSentence: "",
      level: "easy",
      score: 5,
    });
    this.showModal.set(true);
  }

  openEdit(item: FlashcardDTO) {
    this.editing.set(true);
    this.editingId = item.mongoId;
    this.form.patchValue({
      english: item.english,
      german: item.german,
      article: item.article,
      exampleSentence: item.exampleSentence,
      level: item.level,
      score: item.score,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    const payload = {
      english: this.form.value.english,
      german: this.form.value.german,
      article: this.form.value.article,
      exampleSentence: this.form.value.exampleSentence,
      level: this.form.value.level,
      score: this.form.value.score,
      // id & mongoId handled by backend
    } as Omit<FlashcardDTO, "mongoId" | "id">;

    const obs$ =
      this.editing() && this.editingId
        ? this.service.updateFlashcard(this.editingId, payload)
        : this.service.createFlashcard(payload);

    obs$.subscribe(() => {
      this.load();
      this.flash(this.editing() ? "Updated 🎉" : "Created 🎉");
      this.closeModal();
    });
  }

  remove(id: string) {
    if (confirm("Delete this flashcard?")) {
      this.service.deleteFlashcard(id).subscribe(() => {
        this.load();
        this.flash("Deleted 🗑️");
      });
    }
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update((n) => n - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((n) => n + 1);
  }
}
