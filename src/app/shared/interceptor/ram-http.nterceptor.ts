import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthorizationService } from "../../core/services/authorization.service";
import { Injectable } from "@angular/core";


@Injectable()
export class RamHttpInterceptor implements HttpInterceptor {
    constructor(private _authorizationService: AuthorizationService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        const token: string = sessionStorage.getItem('token_bfm');
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });


        return next.handle(request).pipe(
            catchError ((error: HttpErrorResponse ) => {
                if(error.status === 401) {
                    this._authorizationService.setAuthorizationStatus(false);
                }
                return  throwError(error);
            })
        );
    }
}