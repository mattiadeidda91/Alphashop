import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../loading.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  //Intercetta le richieste e abilitare/disabilitare lo spinner

  constructor(private loadingService : LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    this.loadingService.show();

    //Finalize è l'elemento che gestisce quando una richiesta è terminata e quindi nascondiamo lo spinner
    return next.handle(request).pipe(
      finalize(() => 
      {
        this.loadingService.hide();
      })
    );
  }
}
