import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthappService } from 'src/services/authapp.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public authService : AuthappService) { }

  ngOnInit(): void {
  }

  Logout()
  {
    this.authService.ClearSession();
    this.router.navigate(["login"]);
  }

}
