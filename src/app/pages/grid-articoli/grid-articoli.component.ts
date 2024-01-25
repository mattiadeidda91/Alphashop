import { Component, OnInit } from '@angular/core';

import { ArticoliService } from 'src/services/data/articoli.service';
import { IArticoli } from 'src/app/models/IArticoli';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grid-articoli',
  templateUrl: './grid-articoli.component.html',
  styleUrls: ['./grid-articoli.component.css']
})
export class GridArticoliComponent implements OnInit {

  //inizializzo la lista come una lista vuota
  articoli$ : IArticoli[] = [];
  errorBe: string = "";

  //dependency injection del servizio ArticoliService che recupera gli oggetti Articolo (in seguito da backend)
  constructor(private articoliService: ArticoliService) { }

  ngOnInit(): void 
  {
    //recupero e popolo la variabile this.articoli$ con la lista degli oggetti Articolo recuperati dal servizio
    this.articoliService.getArticoliByDesc("Barilla").subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleError.bind(this)
    });
    console.log(this.articoli$);

  }

  //funzione che recupera l'evento(Modifica) del componente figlio passando il codart come parametro
  handleEdit = (codart : string) => {
    console.log("Cliccato tasto modifica del codice " + codart);
  }

   //funzione che recupera l'evento(Elimina) del componente figlio passando il codart come parametro
  handleDelete = (codart : string) => {
    console.log("Cliccato tasto elimina del codice " + codart);

    this.articoli$.splice(this.articoli$.findIndex(x => x.codArt === codart), 1);
    console.log(this.articoli$);

  }

  //Gestisce le risposte positive dalla API backend
  handleResponse(response: IArticoli[]) {
    this.articoli$ = response;
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
