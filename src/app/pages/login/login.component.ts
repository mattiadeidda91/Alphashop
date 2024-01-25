import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthJwtService } from 'src/services/authJwt.service';
import { AuthappService } from 'src/services/authapp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userid: string = "";
  password: string = "";

  authenticate: boolean = true;

  errMsg: string = "Spiacente, la userid e/o la password sono errati!";
  okMsg: string = "Accesso consentito!";

  //Code Injection: aggiungiamo al costruttore la variabile private route che deriva dal componente Router
  //serve per navigare all'interno delle pagine (componenti) del sito in maniera programmatica
  constructor(private route: Router, private authservice: AuthappService, private authJwtService: AuthJwtService) {  }

  ngOnInit(): void {

  }

  //funzione richiamata dall'evento click del button
  gestAuth()
  {
    if((this.userid == "" || this.userid == null || this.userid == undefined) && (this.password == "" || this.password == null || this.password == undefined))
    {
      this.errMsg = "Inserisci la UserID e la password"
      this.authenticate=false;
    }
    else
    {
      if(this.userid == "" || this.userid == null || this.userid == undefined)
      {
        this.errMsg = "Inserisci la UserID"
        this.authenticate=false;
      }
      else if(this.password == "" || this.password == null || this.password == undefined)
      {
        this.errMsg = "Inserisci la password"
        this.authenticate=false;
      }
      else
      {
        //this.authservice.Authenticate(this.userid, this.password).subscribe({  //Basic Auth
        this.authJwtService.Authenticate(this.userid, this.password).subscribe({  //JWT Token
          next: (response) =>
          {
            console.log(response);
            this.authenticate = true;
            this.route.navigate(["welcome", this.userid]); 
          },
          error: (error) => 
          {
            console.log(error);
            this.authenticate = false;
            this.errMsg = "Spiacente, la userid e/o la password sono errati!"
          }
        });
        /*
        VECCHIA GESTIONE SINCRONA
        if(this.authservice.Authenticate(this.userid, this.password))
        {
          this.authenticate=true;
          this.route.navigate(["welcome", this.userid]); // se la login è corretta imposta la rotta verso il componente 'welcome' con parametro registrato nel app-routing-module.ts
        }
        else{
          this.authenticate=false;
          this.errMsg = "Spiacente, la userid e/o la password sono errati!";
        }
        */
      }
  }

    //console.log(this.userid);
  }

}
