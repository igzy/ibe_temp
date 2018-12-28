import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LANGUAGE_KEY, LANGUAGE_CODE_ARABIC, DEFAULT_DIR, DEFAULT_LANGUAGE, AppConfig } from '../../configs/app-settings.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LanguageService {

    directionUpdate = new Subject<string>();
    directionUpdate$ = this.directionUpdate.asObservable();

    language: string;
    languageUpdate = new Subject<string>();
    languageUpdate$ = this.languageUpdate.asObservable();

    constructor(private http: HttpClient) {
    }

    dirUpdate(direction: string) {
        this.directionUpdate.next(direction);
    }

    setLanguage(language: string) {
        this.languageUpdate.next(language);
    }

    getLanguage() {
        this.language = sessionStorage.getItem(LANGUAGE_KEY);
        if (!this.language) {
            this.language = DEFAULT_LANGUAGE;
        }
        return this.language;
    }

    getDir(): string {
        let direction = DEFAULT_DIR;
        const language =  this.getLanguage();
        if (language === LANGUAGE_CODE_ARABIC) {
            direction = 'rtl';
        } else {
            direction = 'ltr';
        }

        return direction;
    }

    getTranslations(module: string): Observable<any> {
        this.getLanguage();
        if (!this.language) {
            this.language = DEFAULT_LANGUAGE;
        }
        console.log(`Invoking ${AppConfig.LANGUAGE_MOCKS}/${module}/flight_search_${this.language}.json`);
        return this.http.get(`${AppConfig.LANGUAGE_MOCKS}/${module}/flight_search_${this.language}.json`);
      }
}
