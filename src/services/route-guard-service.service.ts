import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthappService } from './authapp.service';
import { AuthJwtService } from './authJwt.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

//Servizio che implementa l'interfaccia CanActivate che serve al app-routing.module per verificare l'autenticazione quando accediamo alle pagine
//La verifica inizialmente si basava nel verificare che l'utente fosse loggato, ovvero che fosse presente in sessione lo user, adesso verificheremo i ruoli 
//dell'utente tramite autenticazione JWT Token

export class RouteGuardServiceService implements CanActivate {

  //Usiamo il token di autenticazione per recupera i ruoli e le info
  token : string = '';
  roles : string[] = new Array(); // uguale a = []
  items: any;

  constructor(private router : Router, private authService : AuthappService, private authJwtService: AuthJwtService) { }
  
  //Vecchia gestione dell'autenticazione alle pagine dell'applicazione con il servizio authService (Basic Auth)
  /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) 
  {
    if(!this.authService.IsLogged())
    {
      this.router.navigate(["login"]);
      return false;
    }
    else
      return true;
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) 
  {
    if(!this.authJwtService.IsLogged())
    {
      this.router.navigate(["login"]);
      return false;
    }
    else
    {
      //Verifichiamo i ruoli dell'utente per la specifica pagina a cui sta accedendo
      this.token = this.authJwtService.GetTokenJwt();

      //Recupero info dal token
      const jwtHelper = new JwtHelperService();
      const tokenDecoded = jwtHelper.decodeToken(this.token);

      this.items = tokenDecoded['role']; //la chiave è quella che vediamo sul sito del jwt.io se decodifichiamo il token

      //Può essere un array se ci sono più ruoli o una singola stringa se unico ruolo
      if(!Array.isArray(this.items))
      {
        this.roles.push(this.items);
      }
      else
        this.roles = this.items   

      let pageRoles : string[] = route.data['roles']; //otteniamo i ruoli specificati nell'app-routing.module.ts
      
      if(pageRoles === null || pageRoles.length === 0)
      {
        //Se non ci sono ruoli specificati per la pagina in questione consentiamo l'accesso
        return true;
      }
      else if(this.roles.some(r => pageRoles.includes(r)))
      {
        //Se c'è almeno un ruolo che matcha tra quelli dell'utente e quelli richiesti per l'accesso in pagina, allora consentiamo l'accesso
        return true;
      }
      else
      {
        this.router.navigate(["forbidden"]);
        return false;
      }
    }
  }
}
