import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()

export class ForbiddenInterceptor implements HttpInterceptor {

  //Interceptor che intercetta le richieste Htpp e controlla lo stato degli errori
  //in questo caso per gli errori 401 e 403, quindi quando l'utente non ha i permessi per eseguire qualcosa sull'applicazione

  constructor(private router : Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => 
      {
        //controllo se lo stato di errore è 401 o 403
        if([401, 403].indexOf(err.status) !== -1)
        {
          this.router.navigate(['forbidden']); //reindirizzo alla pagina forbidden
        }

        //Gestione del messaggio di errore
        var error = (err.status != 403) ? err.error.message || err.statusText : "Errore: Privilegi Insufficienti";

        return throwError(() => error); //rilancio l'eccezione con l'errore

      })
    );
  }
}
