import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  loading$ = this.loadingService.loading$;

  constructor(private loadingService : LoadingService) { }

  ngOnInit(): void {
  }

}
