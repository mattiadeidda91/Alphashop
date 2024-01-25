import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IArticoli } from 'src/app/models/IArticoli';

@Component({
  selector: 'app-articoli-card',
  templateUrl: './articoli-card.component.html',
  styleUrls: ['./articoli-card.component.css']
})
export class ArticoliCardComponent implements OnInit {

  constructor() { }

  //Componente figlio di grid-articoli.component.ts


  //oggetto che arriva in input dal componente padre grid-articoli.component.ts
  @Input()
  articolo: IArticoli  = {
    codArt: '',
    descrizione: '',
    um: '',
    codStat:'',
    pzCart: 0,
    pesoNetto: 0,
    prezzo: 0,
    idStatoArt: '',
    descStatoArt:'',
    dataCreazione: new Date(),
    imageUrl: '',
    idIva:-1,
    idFamAss:-1,
    barCodes:[]
  };

  //variabili in output che verranno passate al componente padre grid-articoli.component.ts
  @Output()
  delete = new EventEmitter(); //gestore di eventi
  @Output()
  edit = new EventEmitter(); //gestore di eventi

  ngOnInit(): void {
  }

  //Funzioni sui pulsanti Modifica ed Elimina che vengono gestiti con il gestore di eventi EventEmitter 
  //che ripassa al componente padre la variabile con l'info necessaria (this.articolo.codart)
  editArt = () =>  this.edit.emit(this.articolo.codArt);
  delArt = () => this.delete.emit(this.articolo.codArt);

}
