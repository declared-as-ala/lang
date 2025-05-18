import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService, AdminChallengeDTO } from "../admin.service";

@Component({
  selector: "app-challenge-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./challenge-list.component.html",
  styleUrls: ["./challenge-list.component.css"],
})
export class ChallengeListComponent implements OnInit {
  questions: AdminChallengeDTO[] = [];
  filteredQuestions: AdminChallengeDTO[] = [];
  searchTerm = "";
  isLoading = true;
  error: string | null = null;
  selectedQuestion: AdminChallengeDTO | null = null;
  isEditMode = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.isLoading = true;
    this.error = null;

    this.adminService.getChallengeQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        this.filteredQuestions = questions;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error("Error loading questions:", error);
        this.error = "Failed to load questions. Please try again.";
        this.isLoading = false;
      },
    });
  }

  search() {
    if (!this.searchTerm.trim()) {
      this.filteredQuestions = this.questions;
      return;
    }

    this.filteredQuestions = this.questions.filter(
      (question) =>
        question.question_en
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        question.question_de
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  deleteQuestion(id: string) {
    if (confirm("Are you sure you want to delete this question?")) {
      this.adminService.deleteChallengeQuestion(id).subscribe({
        next: () => {
          this.questions = this.questions.filter(
            (question) => question.id !== id
          );
          this.filteredQuestions = this.filteredQuestions.filter(
            (question) => question.id !== id
          );
        },
        error: (error: Error) => {
          console.error("Error deleting question:", error);
          this.error = "Failed to delete question. Please try again.";
        },
      });
    }
  }

  editQuestion(question: AdminChallengeDTO) {
    this.selectedQuestion = { ...question };
    this.isEditMode = true;
  }

  saveQuestion() {
    if (!this.selectedQuestion) return;

    const operation = this.selectedQuestion.id
      ? this.adminService.updateChallengeQuestion(
          this.selectedQuestion.id,
          this.selectedQuestion
        )
      : this.adminService.createChallengeQuestion(this.selectedQuestion);

    operation.subscribe({
      next: (savedQuestion) => {
        if (this.selectedQuestion?.id) {
          // Update existing question
          const index = this.questions.findIndex(
            (q) => q.id === savedQuestion.id
          );
          if (index !== -1) {
            this.questions[index] = savedQuestion;
          }
        } else {
          // Add new question
          this.questions.push(savedQuestion);
        }
        this.filteredQuestions = [...this.questions];
        this.cancelEdit();
      },
      error: (error: Error) => {
        console.error("Error saving question:", error);
        this.error = "Failed to save question. Please try again.";
      },
    });
  }

  cancelEdit() {
    this.selectedQuestion = null;
    this.isEditMode = false;
  }

  createQuestion() {
    this.selectedQuestion = {
      id: "",
      level: "beginner",
      question_en: "",
      question_de: "",
    };
    this.isEditMode = true;
  }

  getDifficultyClass(level: string): string {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
