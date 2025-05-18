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
import { ConjugationService, Conjugation } from "./conjugation.service";

@Component({
  selector: "app-conjugaison",
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
        <h2 class="text-2xl font-semibold">Conjugation Questions</h2>
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
              <th class="th">Verb</th>
              <th class="th">Tense</th>
              <th class="th">Subject</th>
              <th class="th">Correct</th>
              <th class="th">Diff.</th>
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
              <td class="td">{{ item.verb }}</td>
              <td class="td">{{ item.tense }}</td>
              <td class="td">{{ item.subject }}</td>
              <td class="td">{{ item.correctAnswer }}</td>
              <td class="td">{{ item.difficulty }}</td>
              <td class="td">{{ item.scoreValue }}</td>
              <td class="td text-center">
                <div class="flex justify-center gap-2">
                  <button class="icon-btn" (click)="openEdit(item)">✏️</button>
                  <button
                    class="icon-btn bg-red-600 hover:bg-red-700"
                    (click)="remove(item.id)"
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
          {{ editing() ? "Edit Question" : "Add Question" }}
        </h3>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input class="input" placeholder="Verb" formControlName="verb" />
            <input
              class="input"
              placeholder="Translation"
              formControlName="translation"
            />
            <select class="input" formControlName="tense">
              <option value="" disabled>Tense</option>
              <option *ngFor="let t of tenses" [value]="t">{{ t }}</option>
            </select>
            <input
              class="input"
              placeholder="Subject"
              formControlName="subject"
            />
            <input
              class="input"
              placeholder="Question Text"
              formControlName="questionText"
            />
            <input
              class="input"
              placeholder="Correct Answer"
              formControlName="correctAnswer"
            />
            <input
              class="input"
              placeholder="Wrong answers (comma-separated)"
              formControlName="wrongAnswersRaw"
            />
            <select class="input" formControlName="difficulty">
              <option *ngFor="let d of difficulties" [value]="d">
                {{ d }}
              </option>
            </select>
            <input
              type="number"
              class="input"
              placeholder="Score"
              formControlName="scoreValue"
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
export class ConjugaisonComponent implements OnInit {
  data = signal<Conjugation[]>([]);
  currentPage = signal(1);
  pageSize = 8;
  showModal = signal(false);
  editing = signal(false);
  toast = signal<string | null>(null);
  private editingId: string | null = null;

  form!: FormGroup;

  tenses = ["present", "preterite", "perfect", "future", "conditional"];
  difficulties = ["Easy", "Medium", "Hard"] as const;

  constructor(private service: ConjugationService, private fb: FormBuilder) {}

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
      verb: ["", Validators.required],
      translation: ["", Validators.required],
      tense: ["", Validators.required],
      subject: ["", Validators.required],
      questionText: ["", Validators.required],
      correctAnswer: ["", Validators.required],
      wrongAnswersRaw: [""],
      difficulty: ["Easy", Validators.required],
      scoreValue: [5, [Validators.required, Validators.min(1)]],
    });

    effect(() => {
      this.currentPage.set(Math.min(this.currentPage(), this.totalPages()));
    });
  }

  load() {
    this.service.getAll().subscribe((res) => this.data.set(res));
  }

  openAdd() {
    this.editing.set(false);
    this.editingId = null;
    this.form.reset({
      verb: "",
      translation: "",
      tense: "",
      subject: "",
      questionText: "",
      correctAnswer: "",
      wrongAnswersRaw: "",
      difficulty: "Easy",
      scoreValue: 5,
    });
    this.showModal.set(true);
  }

  openEdit(item: Conjugation) {
    this.editing.set(true);
    this.editingId = item.id;
    this.form.patchValue({
      verb: item.verb,
      translation: item.translation,
      tense: item.tense,
      subject: item.subject,
      questionText: item.questionText,
      correctAnswer: item.correctAnswer,
      wrongAnswersRaw: item.wrongAnswers.join(", "),
      difficulty: item.difficulty,
      scoreValue: item.scoreValue,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    const payload: Partial<Conjugation> = {
      verb: this.form.value.verb,
      translation: this.form.value.translation,
      tense: this.form.value.tense,
      subject: this.form.value.subject,
      questionText: this.form.value.questionText,
      correctAnswer: this.form.value.correctAnswer,
      wrongAnswers: (this.form.value.wrongAnswersRaw as string)
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
      difficulty: this.form.value.difficulty,
      scoreValue: this.form.value.scoreValue,
      questionId: null,
    };

    const obs$ =
      this.editing() && this.editingId
        ? this.service.update(this.editingId, payload)
        : this.service.create(payload);

    obs$.subscribe(() => {
      this.load();
      this.flash(this.editing() ? "Updated 🎉" : "Created 🎉");
      this.closeModal();
    });
  }

  remove(id: string) {
    if (confirm("Delete this item?")) {
      this.service.delete(id).subscribe(() => {
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
