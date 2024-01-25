import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AuthappService } from 'src/services/authapp.service';
import { SalutiDataService } from 'src/services/data/saluti-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

//implementa OnInit che ci obblica a creare il metodo ngOnInit() che è il primo metodo che viene richiamato all'importazione del componente
export class WelcomeComponent implements OnInit {

  user: string = "";
  salutiBe: string = ""
  errorBe: string = "";

  //uso route per recuperare il parametro in ingresso
  constructor(
    private activateRouter: ActivatedRoute, 
    private router : Router, 
    private authService : AuthappService,
    private salutiService : SalutiDataService) { }

  ngOnInit(): void
  {
    this.user = this.activateRouter.snapshot.params["userid"]; //preleva il parametro passato al componente tramite route (querystring)

    //COMMENTATO PERCHE' ABBIAMO IMPLEMENTATO IL SERVIZIO RouteGuardServiceService SULLE ROUTING (anche se questo non verifica che il nome utente sia uguale a quello salvato in Session rispetto all'Url)
    //Redirect to Login if the user is not logged or if user != to this.user
    /*if(!(this.authService.IsLogged() && this.authService.GetLoggedUser() === this.user))
    {
      this.router.navigate(["login"]);
    }*/
  }

  //Metodo di test per interazione con backend
  //che effettuerà una chiamata facendosi restituire le info richieste (i saluti, ovvero una semplice stringa)
  getSaluti = () =>
  {
    //Usare il metodo subscribe per effettuare la chiamata async
    /*Questo è il semplificato facendo gestire sia risposte positive che negative dalla webApi
    this.salutiService.getSalutiBE(this.user).subscribe(
      response => this.handleResponse(response)
    );*/

    /* Questo fa gestire le diverse risposte positive e negative a due handle specifici */
    this.salutiService.getSalutiBE(this.user).subscribe({
      next: this.handleResponse.bind(this), //positive
      error: this.handleError.bind(this)    //negative
    });
  } 

  //Gestisce le risposte positive dalla API backend
  handleResponse(response: Object) {
    this.salutiBe = response.toString();
  }

  //Gestisce gli errori che arrivano dalla API backend
  handleError(response: any) 
  {
    console.log(response);

    if(response instanceof HttpErrorResponse)
    {
      this.errorBe = response.message;
    }
    else{
      this.errorBe = response;
    }
  }

}
