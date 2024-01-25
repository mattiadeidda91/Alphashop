import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { IArticoli } from 'src/app/models/IArticoli';
import { IFamAssort } from 'src/app/models/IFamAssort';
import { IIva } from 'src/app/models/IIva';
import { ArticoliService } from 'src/services/data/articoli.service';

@Component({
  selector: 'app-manage-art',
  templateUrl: './manage-art.component.html',
  styleUrls: ['./manage-art.component.css']
})

export class ManageArtComponent implements OnInit {

  isModify: boolean = false;
  title: string = ""
  codArt:string = "";

  isLoading: boolean = true;
  backendMsg: string='' //mostra il messsaggio se l'operazione è andata a buon fine o meno
  isSuccess: boolean | null = null; //mostra alert success se l'operazione sull'Articolo è andato a buon fine

  //N.B. Se non voglio inizializzare l'oggetto con tutte le proprietà
  //posso usare la classe concreta invece che l'interfaccia:
  /*
    class Articolo implements IArticoli {
      codArt: string = '';
      descrizione: string = '';
      um: string = '';
      codStat: '',
      pzCart: number = 0;
      pesoNetto: number = 0;
      prezzo: number = 0;
      idStatoArt: string = '';
      descStatoArt: string = '';
      dataCreazione: Date = new Date();
      imageUrl: string = '';
      iva: IIva = {}; // Inizializza l'oggetto IIva come vuoto
    }
}
  */
  articolo: IArticoli  = {
    codArt: '',
    descrizione: '',
    um: '-1',
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

  ivas: IIva[] = [];
  famAssorts: IFamAssort[] =[];
  barcode: string =''; //serve per ricavare il barcode dalla lista dei barCode in IArticolo (soluzione temporanea non scelta migliore)

  constructor(private route: ActivatedRoute, private router: Router, private articoliService: ArticoliService) { }

  ngOnInit(): void 
  {
    this.codArt = this.route.snapshot.params["codart"];

    this.articoliService.getAllIva().subscribe(
      response => this.ivas = response
    );

    this.articoliService.getAllFamAssort().subscribe(
      response => {
        this.famAssorts = response
      }
    );

    this.isModify = this.codArt ? true : false;
    this.title = this.isModify ? "Modifica Articolo" : "Inserisci Articolo";

    if(this.isModify)
      this.getArticoloByCode(this.codArt);
    else
      this.isLoading=false;
  }

  getArticoloByCode = (codArt : string) =>
  {
    this.articoliService.getArticoliByCode(codArt).subscribe({
      next: this.handleResponse.bind(this),
      error: this.handleError.bind(this)
    });
  }

  back()
  {
    if(this.isModify)
      this.router.navigate(['articoli'], { queryParams: { filter: this.codArt } });
    else
      this.router.navigate(['articoli']);
  }

  save()
  {
    //console.log("stai per salvare questo Articolo", this.articolo);
    this.isLoading = true;

    if(this.isModify)
    {
      /* Funziona ma per differenziare i casi di success e di error con rispettivo msg si preferisce l'implementazione fatta sopra
        response =>{
          this.isSuccess = response as boolean;
        }
      */
      this.articoliService.updateArticolo(this.articolo).subscribe(
        {
          next: this.handleResponseUpdate.bind(this),
          error: (response) =>
          {
            //esempio per come si può utilizzare anche il next e error
            //this.handleError.bind(this)
            console.log(response);
            this.backendMsg = response.error?.message ?? response.message;
            this.isSuccess = false;
            this.isLoading=false;
          }
        });
    }
    else
    {
      //Creazione
      this.articoliService.saveArticolo(this.articolo).subscribe(
        {
          next: this.handleResponseUpdate.bind(this),
          error: this.handleError.bind(this)
        });
    }
  }

  /* GESTIONE ERRORI E RISPOSTE */

  handleResponseUpdate(response: ApiResponse)
  {
    this.isSuccess = response.isSuccess;

    //CAMBIATA STRUTTURA DEGLI OBJ DI RISPTA BACKEND
    /*
    if(this.isSuccess)
      this.backendMsg = "Articolo modificato correttamente";
    else
      this.backendMsg = "Errore! Articolo non modificato";
    */
    this.backendMsg = response.message;

    this.isLoading=false;
  }

  handleResponse(response: any) 
  {
    console.log("response", response);

    this.articolo = response;
    this.barcode = this.articolo.barCodes.length > 0 ? this.articolo.barCodes[0].barcode : ""; //prelevo il primo barcode dalla lista (NO BEST SOLUTION)

    this.isLoading=false;
    console.log("articolo", this.articolo);
  }

  handleError(response: any) {
    console.log(response);
    this.backendMsg = response.error.message ?? response.message;
    this.isSuccess = false;
    this.isLoading=false;
  }

}
