import { IBarcode } from "./IBarcode"
import { IFamAssort } from "./IFamAssort"
import { IIva } from "./IIva"

export interface IArticoli {
  codArt: string
  descrizione: string
  um: string
  pzCart: number
  codStat:string
  pesoNetto: number
  prezzo: number
  idStatoArt: string
  descStatoArt:string
  dataCreazione: Date
  imageUrl: string
  idIva: number
  idFamAss: number
  barCodes: IBarcode[]
  //lui aggiunge direttamente le proprietà che servono senza il riferimento alla class
  //iva: IIva
  //famAssort: IFamAssort
}
