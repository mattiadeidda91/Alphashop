import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { ArticoliComponent } from './pages/articoli/articoli.component';
import { CoreModule } from './core/core.module';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { GridArticoliComponent } from './pages/grid-articoli/grid-articoli.component';
import { ArticoliCardComponent } from './components/articoli-card/articoli-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ManageArtComponent } from './pages/manage-art/manage-art.component'; //componente esterno per la paginazione (npm i ngx-pagination)
import { AuthInterceptorService } from 'src/services/interceptors/auth-interceptor.service';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ForbiddenInterceptor } from 'src/services/interceptors/forbidden.interceptor';
import { NetworkInterceptor } from 'src/services/interceptors/network.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    ErrorComponent,
    ArticoliComponent,
    GridArticoliComponent,
    ArticoliCardComponent,
    ManageArtComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CoreModule,
    NgxPaginationModule,
    HttpClientModule, //Serve per le connessioni Http e integrazione Backend (la parte TranslateModule.forRoot serve per gestire le traduzioni)
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  providers: [
    //Registra il nostro interceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, //gestisce l'autenticazione
    {provide: HTTP_INTERCEPTORS, useClass: ForbiddenInterceptor, multi: true}, //gestisce gli errori (in questo caso 401 e 403)
    {provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true} //gestisce lo spinner ad inizio e fine delle richieste Http

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
