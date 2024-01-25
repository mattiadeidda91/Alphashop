import { IArticoli } from 'src/app/models/IArticoli';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs'; //libreria per poter utilizzare il map (permette di modificare il flusso di info, ovvere mappare i campi)
import { IIva } from 'src/app/models/IIva';
import { IFamAssort } from 'src/app/models/IFamAssort';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticoliService {

  /*
  //Hard coded poi questi dati arriveranno da backend
  articoli: IArticoli[]  = [
    {codart : '014600301', descrizione : 'BARILLA FARINA 1 KG', um : 'PZ', pzcart : 24, peso : 1, prezzo : 1.09, active : true, data : new Date(), imageUrl: 'assets/images/prodotti/014600301.jpg'},
    {codart : "013500121", descrizione : "BARILLA PASTA GR.500 N.70 1/2 PENNE", um : "PZ", pzcart : 30, peso : 0.5, prezzo : 1.3, active : true, data : new Date(), imageUrl: 'assets/images/prodotti/013500121.jpg'},
    {codart : "014649001", descrizione : "BARILLA PANNE RIGATE 500 GR", um : "PZ", pzcart : 12, peso : 0.5, prezzo : 0.89, active : true, data : new Date(), imageUrl: 'assets/images/prodotti/014649001.jpg'},
    {codart : "007686402", descrizione : "FINDUS FIOR DI NASELLO 300 GR", um : "PZ", pzcart : 8, peso : 0.3, prezzo : 6.46, active : true, data : new Date(), imageUrl: 'assets/images/prodotti/007686402.jpg'},
    {codart : "057549001", descrizione : "FINDUS CROCCOLE 400 GR", um : "PZ", pzcart : 12, peso : 0.4, prezzo : 5.97, active : true, data : new Date(), imageUrl: 'assets/images/prodotti/057549001.jpg'},
  ]
  */

  server: string = environment.server; //prelevo il server dal file environment (variabili d'ambiente)
  port: string = environment.port; //prelevo la porta dal file environment (variabili d'ambiente)

  constructor(private httpClient: HttpClient) { }

  /* COMMENTATO PER FAR SPAZIO ALL?INTERAZIONE CON IL BACKEND
  getArticoli = () : IArticoli[] => this.articoli;

  */

  /*
    VECCHIO CODICE CON ARTICOLI SCHIANTATI NEL CODICE (VEDI ARRAY SOPRA)
     getArticoliByCode = (codart: string) => {
        const index = this.articoli.findIndex(articoli => articoli.codart === codart);
        return this.articoli[index];
     }
  */


  getArticoliByCode = (codart: string) => 
  {
    return this.httpClient.get<IArticoli>(`http://${this.server}:${this.port}/articoli/getbycodart/${codart}`).pipe(
      map(res => {
        res.descStatoArt = this.getDescStatoArt(res.idStatoArt);
        return res;
      })
    );
  }


  getArticoliByDesc = (description : string) =>
  {
    //backtick per l'utilizzo di variabili all'interno della stringa -> ALT + 0096 | ALT GR + '(non funzionano) 
    return this.httpClient.get<IArticoli[]>(`http://localhost:5219/articoli/getbydescription/${description}`).pipe(
      //mappo la proprietà idStatoArt gestendo i vari Id e convertendoli in una stringa di descrizione dello stato
      map(response =>{
        response.forEach(item => item.descStatoArt = this.getDescStatoArt(item.idStatoArt));
        return response;
      })
    );
  }

  getArticoliByBarCode = (barcode: string) => 
  {
    return this.httpClient.get<IArticoli>(`http://${this.server}:${this.port}/articoli/getbybarcode/${barcode}`).pipe(
      map(res => {
        res.descStatoArt = this.getDescStatoArt(res.idStatoArt);
        return res;
      })
    );
  }

  deleteArticolo =(codArt : string) =>
    this.httpClient.delete(`http://${this.server}:${this.port}/articoli/delete/${codArt}`);

  /*
    far tornare un oggetto di risposta che arriva dal backend e creato anche qui nel front-end, invece che il valore boolean
    ad esempio la classe ApiMsg:
      export interface ApiMsg{
        message: string
      }
  */
  updateArticolo = (articolo: IArticoli) =>
    this.httpClient.put<ApiResponse>(`http://${this.server}:${this.port}/articoli/update`, articolo);

  saveArticolo = (articolo: IArticoli) =>
      this.httpClient.post<ApiResponse>(`http://${this.server}:${this.port}/articoli/create`, articolo);

  getDescStatoArt = (idStatus : string) : string =>
  {
    if(idStatus === "1")
      return "Attivo";
    else if(idStatus === "2")
      return "Sospeso";
    else
      return "Eliminato";
  }

  //IVA
  getAllIva = () => this.httpClient.get<IIva[]>(`http://${this.server}:${this.port}/iva`);

  //FAMASSORT
  getAllFamAssort = () => this.httpClient.get<IFamAssort[]>(`http://${this.server}:${this.port}/famassort`);
}
