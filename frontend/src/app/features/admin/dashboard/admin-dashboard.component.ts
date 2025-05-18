import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Chart, registerables } from "chart.js";
import { AdminService } from "../admin.service";
import { forkJoin, Subscription } from "rxjs";

Chart.register(...registerables);

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
      >
        <h2
          class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight"
        >
          Dashboard Overview
        </h2>
        <div class="mt-3 sm:mt-0 text-sm text-gray-500">
          Last updated: {{ lastUpdated | date : "medium" }}
        </div>
      </div>

      <!-- Stats Overview -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8"
      >
        <div
          class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-br from-teal-400 to-teal-600 text-white p-5"
        >
          <div
            class="absolute inset-0 opacity-10 bg-[url('/assets/pattern.svg')]"
          ></div>
          <div class="relative flex items-center mb-3">
            <span class="text-3xl mr-3">👥</span>
            <h3 class="text-lg font-semibold">Total Users</h3>
          </div>
          <p class="text-4xl font-bold">{{ totalUsers }}</p>
          <p class="mt-1 text-sm opacity-90">+{{ newUsers }} this week</p>
        </div>

        <div
          class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-br from-pink-400 to-pink-600 text-white p-5"
        >
          <div
            class="absolute inset-0 opacity-10 bg-[url('/assets/pattern.svg')]"
          ></div>
          <div class="relative flex items-center mb-3">
            <span class="text-3xl mr-3">🎴</span>
            <h3 class="text-lg font-semibold text-cyan-50">Flashcards</h3>
          </div>
          <p class="text-4xl font-bold ">{{ totalFlashcards }}</p>
          <p class="mt-1 text-sm opacity-90">Learning items</p>
        </div>

        <div
          class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-br from-green-400 to-green-600 text-white p-5"
        >
          <div
            class="absolute inset-0 opacity-10 bg-[url('/assets/pattern.svg')]"
          ></div>
          <div class="relative flex items-center mb-3">
            <span class="text-3xl mr-3">📝</span>
            <h3 class="text-lg font-semibold">Conjugations</h3>
          </div>
          <p class="text-4xl font-bold">{{ totalConjugations }}</p>
          <p class="mt-1 text-sm opacity-90">Practice items</p>
        </div>

        <div
          class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-br from-purple-400 to-purple-600 text-white p-5"
        >
          <div
            class="absolute inset-0 opacity-10 bg-[url('/assets/pattern.svg')]"
          ></div>
          <div class="relative flex items-cent er mb-3">
            <span class="text-3xl mr-3">🔄</span>
            <h3 class="text-lg font-semibold">Synonyms</h3>
          </div>
          <p class="text-4xl font-bold">{{ totalSynonyms }}</p>
          <p class="mt-1 text-sm opacity-90">Word pairs</p>
        </div>

        <div
          class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-5"
        >
          <div
            class="absolute inset-0 opacity-10 bg-[url('/assets/pattern.svg')]"
          ></div>
          <div class="relative flex items-center mb-3">
            <span class="text-3xl mr-3">✍️</span>
            <h3 class="text-lg font-semibold">Fill Blanks</h3>
          </div>
          <p class="text-4xl font-bold">{{ totalFillBlanks }}</p>
          <p class="mt-1 text-sm opacity-90">Exercises</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">
            User Level Distribution
          </h3>
          <canvas id="userLevelChart" class="max-h-64 w-full"></canvas>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">
            Content Distribution by Level
          </h3>
          <canvas
            id="contentDistributionChart"
            class="max-h-64 w-full"
          ></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @media (max-width: 640px) {
        canvas {
          max-height: 48vw !important;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  lastUpdated = new Date();
  totalUsers = 0;
  totalFlashcards = 0;
  totalConjugations = 0;
  totalSynonyms = 0;
  totalFillBlanks = 0;
  newUsers = 0;
  private subscriptions: Subscription[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadStats() {
    const stats$ = forkJoin({
      users: this.adminService.getUsers(),
      flashcards: this.adminService.getFlashcards(),
      conjugations: this.adminService.getConjugations(),
      synonyms: this.adminService.getSynonyms(),
      fillBlanks: this.adminService.getFillBlanks(),
    });

    this.subscriptions.push(
      stats$.subscribe({
        next: (data) => {
          this.totalUsers = data.users.length;
          this.totalFlashcards = data.flashcards.length;
          this.totalConjugations = data.conjugations.length;
          this.totalSynonyms = data.synonyms.length;
          this.totalFillBlanks = data.fillBlanks.length;

          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          this.newUsers = data.users.filter(
            (u) => new Date(u.id.substring(0, 8)) > weekAgo
          ).length;

          this.initializeCharts(data);
        },
        error: (err) => console.error("Error loading dashboard stats:", err),
      })
    );
  }

  private initializeCharts(data: any) {
    // User Level Distribution
    const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
    const userCounts = levels.map(
      (l) => data.users.filter((u: any) => u.level === l).length
    );
    new Chart("userLevelChart", {
      type: "pie",
      data: {
        labels: ["Beginner", "Intermediate", "Advanced"],
        datasets: [
          {
            data: userCounts,
            backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      },
    });

    // Content Distribution by Level
    const bracket = {
      easy: {
        flash: data.flashcards.filter((f: any) => f.level === "easy").length,
        conj: data.conjugations.filter((c: any) => c.difficulty === "Easy")
          .length,
        syn: data.synonyms.filter((s: any) => s.level === "easy").length,
        fill: data.fillBlanks.filter((f: any) => f.level === "Easy").length,
      },
      medium: {
        flash: data.flashcards.filter((f: any) => f.level === "medium").length,
        conj: data.conjugations.filter((c: any) => c.difficulty === "Medium")
          .length,
        syn: data.synonyms.filter((s: any) => s.level === "medium").length,
        fill: data.fillBlanks.filter((f: any) => f.level === "Medium").length,
      },
      hard: {
        flash: data.flashcards.filter((f: any) => f.level === "hard").length,
        conj: data.conjugations.filter((c: any) => c.difficulty === "Hard")
          .length,
        syn: data.synonyms.filter((s: any) => s.level === "hard").length,
        fill: data.fillBlanks.filter((f: any) => f.level === "Hard").length,
      },
    };

    new Chart("contentDistributionChart", {
      type: "bar",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            label: "Flashcards",
            data: [
              bracket.easy.flash,
              bracket.medium.flash,
              bracket.hard.flash,
            ],
            backgroundColor: "#DB2777",
          },
          {
            label: "Conjugations",
            data: [bracket.easy.conj, bracket.medium.conj, bracket.hard.conj],
            backgroundColor: "#10B981",
          },
          {
            label: "Synonyms",
            data: [bracket.easy.syn, bracket.medium.syn, bracket.hard.syn],
            backgroundColor: "#8B5CF6",
          },
          {
            label: "Fill Blanks",
            data: [bracket.easy.fill, bracket.medium.fill, bracket.hard.fill],
            backgroundColor: "#F59E0B",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  }
}
