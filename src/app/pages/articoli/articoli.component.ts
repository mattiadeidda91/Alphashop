import { Component, OnInit } from '@angular/core';
import { IArticoli } from '../../models/IArticoli';
import { ArticoliService } from 'src/services/data/articoli.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.css']
})
export class ArticoliComponent implements OnInit {

  articoli$ : IArticoli[] = [];

  errorBe : string = '';
  isSuccess: boolean = false; //mostra alert success se l'operazione sull'Articolo è andato a buon fine
  codArt : string = ''; //serve per memorizzare la info da passare all'handleResponseDel per la rimozione dell'Articolo nell'array articoli$

  //Paginazione con ngx-pagination
  pageSize: number = 10;
  pageNumber: number = 1;

  //Spinner
  isLoading: boolean = true;

  //filter queryString
  filter$ : Observable<string | null> = of(""); //Observable e of() fanno parte della libreria rxjs
  filter : string | null = ""; //serve per assegnare il valore del filtro prelevato in queryString tramite filter$
  filterType : number = 0; //serve per gestire la ricerca sul filtro basata su "descrizione","codArt","barcode"

  constructor(private articoliService: ArticoliService, private route: ActivatedRoute, private router : Router) { }

  ngOnInit(): void 
  {
    //Recupero le informazioni in queryString con il nome 'filter' -> localhost:4200/articoli?filter=barilla
    this.filter$ = this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('filter')),
    );

    //Assegno il valore recuperato in queryString alla variabile filter per poterla utilizzare
    this.filter$.subscribe(param => this.filter = param);

    //se il filtro contiene un valore chiamiamo il back-end per farci restiuire i dati altrimenti no
    if(this.filter)
      this.getArticoli(this.filter);
    else
      this.isLoading=false;
  }

  getArticoli = (filter : string) =>
  {
    this.isLoading = true;
    this.isSuccess = false;
    this.errorBe = ""; //rinizializzo la variabile d'errore altrimenti vedrei sempre il messaggio
    this.articoli$ = []; //rinizializzo l'array altrimenti continuerei a vedere gli Articoli delle precedenti ricerche

    //GESTISCO LE DIVERSE TIPOLOGIE DI RICERCA E DI CHIAMATE AL BACKEND
    if(this.filterType === 0)
    {
      this.articoliService.getArticoliByCode(filter).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
    else if(this.filterType === 1)
    {
      this.articoliService.getArticoliByDesc(filter).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
    else if(this.filterType === 2)
    {
      this.articoliService.getArticoliByBarCode(filter).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
  }

  //Aggiorna il filtro andando a ricercare gli elementi che corrispondo
  //metodo chiamato nell'html nella barra di ricerca
  refresh = () =>
  {
    if(this.filter)
    {
      this.getArticoli(this.filter);
    }
  }

  deleteArticolo = (codArt : string) =>
  {
    this.isLoading = true;
    this.isSuccess = false;
    this.codArt = codArt;

    this.articoliService.deleteArticolo(codArt).subscribe({
      next: this.handleResponseDel.bind(this),
      error: this.handleError.bind(this)
    });
  }

  modify = (codArt : string) =>{
    this.router.navigate(["manage", codArt]);
  }

  /* GESTIONE ERRORI E RISPOSTE */

  handleResponseDel(response: any)
  {
    console.log(response);

    this.isSuccess = response;
    this.articoli$ = this.articoli$.filter(item => item.codArt !== this.codArt); //rimozione dell'Articolo nel nostro array
    this.codArt = "";
    this.isLoading = false;
  }

  //Gestisce le risposte positive dalla API backend
  handleResponse(response: any) 
  {
    console.log(response);

    if(this.filterType === 0 || this.filterType == 2)
    {
      //Un solo Articolo
      //Genero un array di appoggio e inserisco il singolo Articolo all'interno dei this.articoli$
      let newArray : IArticoli[] = [...this.articoli$, response];
      this.articoli$ = newArray;
    }
    else
    {
      this.articoli$ = response;
    }
    
    this.filterType = 0; //rinizializzo il filterType a 0
    this.isLoading = false;
  }

  //Gestisce gli errori che arrivano dalla API backend
  handleError(error: any)
  {
    console.log(error);

    if(this.filter && this.filterType === 0)
    {
      //Se alla prima ricerca (this.filterType === 0) non viene trovato niente provo con il secondo tipo di filtro
      this.filterType = 1;
      this.getArticoli(this.filter);
    }
    else if(this.filter && this.filterType === 1){
      //Se alla seconda ricerca (this.filterType === 1) non viene trovato niente provo con il terzo tipo di filtro
      this.filterType = 2;
      this.getArticoli(this.filter);
    }
    else
    {
      //this.errorBe = response.error.message; //Commento perchè gestito dall'forbiddenInterceptor
      this.errorBe = error;
      this.filterType = 0;
      this.isLoading = false;
    }
  }

}
