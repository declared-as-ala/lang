import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));