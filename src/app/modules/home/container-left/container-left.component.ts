import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-left',
  templateUrl: './container-left.component.html',
  styleUrls: ['./container-left.component.scss']
})
export class ContainerLeftComponent {

  constructor(
      private router: Router
  ) { }

  public viewAllProjects() {
    this.router.navigate(['project/overview']);
  }

}
