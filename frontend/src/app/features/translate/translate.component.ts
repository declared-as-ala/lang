import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { TranslateService } from "./translate.service";

@Component({
  selector: "app-translate",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./translate.component.html",
  styleUrls: ["./translate.component.css"],
})
export class TranslateComponent implements OnInit, OnDestroy {
  /* Onglet actif */
  translationType: "word" | "text" = "word";

  /* Forms */
  wordForm: FormGroup;
  translateForm: FormGroup;

  /* State */
  isLoading = false;

  /* Résultats mot */
  translatedWord: string | null = null;
  pronunciation: string | null = null;
  wordContext: { english: string; german: string } | null = null;
  safeImageUrl: SafeResourceUrl | null = null;

  /* Résultat texte */
  translatedText: string | null = null;

  /* Langues */
  languages = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
  ];

  private watcher?: Subscription;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    /* Form mot */
    this.wordForm = this.fb.group({
      word: ["", Validators.required],
      fromLanguage: ["en", Validators.required],
      toLanguage: ["de", Validators.required],
    });

    /* Form texte */
    this.translateForm = this.fb.group({
      text: ["", [Validators.required, Validators.maxLength(500)]],
      fromLanguage: ["en", Validators.required],
      toLanguage: ["de", Validators.required],
    });
  }

  /* Auto-bascule mot → paragraphe */
  ngOnInit(): void {
    this.watcher = this.wordForm
      .get("word")!
      .valueChanges.subscribe((val: string) => {
        if (val && /\s/.test(val)) {
          const { fromLanguage, toLanguage } = this.wordForm.value;
          this.translateForm.patchValue({
            text: val.trim(),
            fromLanguage,
            toLanguage,
          });
          this.wordForm.patchValue({ word: "" }, { emitEvent: false });
          this.translationType = "text";
        }
      });
  }

  ngOnDestroy(): void {
    this.watcher?.unsubscribe();
  }

  /* ——— Traduction mot ——— */
  translateWord(): void {
    if (this.wordForm.invalid) return;
    this.isLoading = true;
    this.resetTranslation();

    const { word, fromLanguage, toLanguage } = this.wordForm.value;

    this.translateService
      .translateWord(word, fromLanguage, toLanguage)
      .subscribe({
        next: (res) => {
          if (res.status === "success") {
            this.translatedWord = res.german;
            this.pronunciation = res.pronunciation;
            this.wordContext = {
              english: res.exampleEnglish,
              german: res.exampleGerman,
            };
            this.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              res.imageUrl
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Translation error:", err);
          this.isLoading = false;
        },
      });
  }

  /* ——— Traduction texte ——— */
  translateText(): void {
    if (this.translateForm.invalid) return;
    this.isLoading = true;
    this.resetTranslation();

    const { text, fromLanguage, toLanguage } = this.translateForm.value;

    this.translateService
      .translateText(text, fromLanguage, toLanguage)
      .subscribe({
        next: (res) => {
          this.translatedText = res.translated;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Translation error:", err);
          this.isLoading = false;
        },
      });
  }

  /* ——— Écouter la traduction ——— */
  speakTranslation(): void {
    if (!this.translatedWord) return;

    const utter = new SpeechSynthesisUtterance(this.translatedWord);
    /* 🔸 On tente de choisir une voix allemande */
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find((v) => v.lang.startsWith("de")) || voices[0];
    utter.voice = deVoice;
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.cancel(); // stop any current speech
    window.speechSynthesis.speak(utter);
  }

  /* ——— Utils ——— */
  resetTranslation(): void {
    this.translatedWord = null;
    this.pronunciation = null;
    this.wordContext = null;
    this.safeImageUrl = null;
    this.translatedText = null;
    /* Stop speech if still speaking */
    window.speechSynthesis.cancel();
  }

  swapLanguages(form: "word" | "text"): void {
    const current = form === "word" ? this.wordForm : this.translateForm;
    const from = current.get("fromLanguage")!.value;
    const to = current.get("toLanguage")!.value;
    current.patchValue({ fromLanguage: to, toLanguage: from });

    if (form === "word" && this.translatedWord) {
      current.patchValue({ word: this.translatedWord });
      this.translateWord();
    } else if (form === "text" && this.translatedText) {
      current.patchValue({ text: this.translatedText });
      this.translateText();
    }
  }
}
