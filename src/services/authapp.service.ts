import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/environment';

/* 
  BASIC AUTH vs JWT
  
  Basic: 
    Contro:
      il token generato non ha scadenza, quindi chi se ne impossessa può fare quello che vuole
      non abbiamo info sui ruoli(info) dell'utente autenticato

  JWT (JSON WEB TOKEN) -> BEST PRACTICES:
      Descrizione:
        -Sito ufficiale: https://jwt.io/
        -è un oggetto JSON standard con il quale è possibile trasferire in maniera sicura informazioni tra le parti
        -le info vengono memorizzate in una stringa alfanumerica chiamata Token
        -il Token è costituito da 3 elementi: Header, Payload, Signature
          -Header: contiene le info che riguardano l'algoritmo di criptaggio delle info (es. HS256)
          -Payload: contiene le informazioni da scambiare
          -Signature: deve contentenere la chiave (parola chiave che deve essere conosciuta tra le parti per poter cominicare e intercettare le info) per decriptare i dati
        -tramite il JWT è possibile garantire l'autenticazione (tramite user e psw) e l'autorizzazione(tramite ruoli) per far accedere a specifiche funzioni/pagine
        -permette di specificare la durata di validità del Token

  STRUTTURA DI AUTENTICAZIONE UTILIZZATA:
    Front-end chiama Alphashop_UserWebService (WebApi .net core) passando userId e psw per richiedere il token e autenticarsi
    Ricevuto il token possiamo autorizzare gli accessi all'Alphashop_ArticoliWebService (WebApi .net core) passando il token e potendo così comunicare e scambiare i dati
*/

@Injectable({
  providedIn: 'root'
})

export class AuthappService {

  server: string = environment.server;
  port: string = environment.port;

  constructor(private httpClient: HttpClient) { }

  Authenticate(userid: string, password: string)
  {
    let authString : string = "Basic " + window.btoa(userid + ":" + password);

    //Passare l'Auth Basic tramite headers
    let headers = new HttpHeaders(
      {Authorization: authString}
    );

    //siccome la chiamata adesso è async non possiamo inserire come prima i dati in sessione, per farlo usare il map()
    return this.httpClient.get<ApiResponse>(`http://${this.server}:${this.port}/articoli/authenticate`, {headers}).pipe(
      map(
        data =>
        {
          sessionStorage.setItem("User", userid);

          //memorizziamo il token di autenticazione nella sessione per far gestire nel nostro Interceptor gli headers con l'utente corrente
          sessionStorage.setItem("AuthToken", authString); 

          return data;
        }
      )
    )
  }

  /*Authenticate = (userid: string, password: string) : boolean =>
  {
    var result = (userid === "Mattia" && password === "123_Stella") ? true : false;

    //memorizzo nella Session il nome utente
    if(result){
      sessionStorage.setItem("User", userid);
    }

    return result;
  }*/

  GetLoggedUser = () : string|null => (sessionStorage.getItem("User")) ? sessionStorage.getItem("User") : "";

  IsLogged = () : boolean => sessionStorage.getItem("User") ? true : false;

  ClearSession = () : void => sessionStorage.clear();

}
