import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthappService } from '../authapp.service';
import { AuthJwtService } from '../authJwt.service';

@Injectable({
  providedIn: 'root'
})

//implementate HttpInterceptor
//Intercettiamo le richieste http aggiungendo gli headers (salvati in sessione al momento di login) sulle req (richieste intercettate)
//Bisogna poi registrare l'interceptor in app.module.ts
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthappService, private authJwtService : AuthJwtService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    /*
    let userId: string = "Mattia";
    let psw: string = "123_Stella";
    */

    let headers = this.authJwtService.GetTokenJwt();  //Per Auth Basic - > "Basic " + window.btoa(userId + ":" + psw);

    //aggiunge gli headers sulla req (richiesta intercettata)
    //utilizziamo il metodo IsLogged del authService per sapere se l'utente è loggato perchè avremmo problemi con il metodo di autenticazione nella Login
    //siccome l'interceptor intercetterebbe anche la nostra richiesta di login restituendo sempre 401, in questo modo evitiamo di fargli intercettare quella richiesta di login
    //FUNZIONA MA MALE IN FASE DI LOGIN SE SI RIPETE LA LOGIN ECC... possibili gestioni:
      //1. nella login verificare se l'utente è già loggato, se sì mandarlo sulla welcome page
      //2. nell'intercptor escludere l'intercettazione se il path della pagina è quello di login
    if(this.authJwtService.IsLogged())
    {
      req = req.clone({
        setHeaders : {Authorization : headers != null ? headers : ""}
      });
    }

    //restituisce la richiesta intercettata
    return next.handle(req);

  }

}
