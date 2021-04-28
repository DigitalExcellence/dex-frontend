import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor(private authService: AuthService) { }


  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
