import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Servizio che si occuperà di interagire con il backend per recuperare le info (in questo caso per i saluti)
export class SalutiDataService {

  //httpClient ci permette di effettuare le chiamate al backend
  constructor(private httpClient: HttpClient) { }

  //al momento ho rimosso il tipo di ritorno perchè il metodo http.get ritorna un oggetto Observable e non può essere gestito in string come ritorno della funzione
  //Il motivo è che httpClient viaggia in modalità asyncrona e quindi dobbiamo ritornare un Observable<Object>
  getSalutiBE = (user: string) : Observable<Object> => 
    this.httpClient.get("http://localhost:5032/saluti?name=" + user);
}
