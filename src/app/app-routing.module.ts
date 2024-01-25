import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ArticoliComponent } from './pages/articoli/articoli.component';
import { RouteGuardServiceService } from 'src/services/route-guard-service.service';
import { GridArticoliComponent } from './pages/grid-articoli/grid-articoli.component';
import { ManageArtComponent } from './pages/manage-art/manage-art.component';
import { UserRoles } from './models/UserRoles';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

//inserire le rotte da gestire
//RouteGuardServiceService intercetta le richiesta e verifica se l'utente ha i permessi per accederci
//data: { roles: [UserRoles.user] } -> specificare i ruoli che deve avere l'utente per poter accedere alla pagina
//Inserisco solo USER perchè gli utenti ADMIN della nostra applicazione contengono anche il ruolo USER, altrimenti avrei dovuto specificare anche quel ruole nell'array
const routes: Routes = [
  { path: '', component: LoginComponent }, //default page
  { path: 'login', component: LoginComponent },
  { path: 'welcome/:userid', component: WelcomeComponent , canActivate: [RouteGuardServiceService], data: { roles: [UserRoles.user] } }, //route con parametri: "/:nomeParametro"
  { path: 'articoli', component: ArticoliComponent , canActivate: [RouteGuardServiceService], data: { roles: [UserRoles.user] } },
  { path: 'articoli/grid', component: GridArticoliComponent , canActivate: [RouteGuardServiceService], data: { roles: [UserRoles.user] } },
  { path: 'manage/:codart', component: ManageArtComponent , canActivate: [RouteGuardServiceService], data: { roles: [UserRoles.admin] } }, //Modifica
  { path: 'manage', component: ManageArtComponent , canActivate: [RouteGuardServiceService], data: { roles: [UserRoles.admin] } }, //Creazione
  { path: 'forbidden', component: ForbiddenComponent }, //pagina di redirect se l'utente non ha i permessi per accedere (alternita è nascondere i pulsanti sulla base dei ruoli)
  { path: '**', component: ErrorComponent } // ** indica un path sbagliato e deve essere impostato come ultimo elemento
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
