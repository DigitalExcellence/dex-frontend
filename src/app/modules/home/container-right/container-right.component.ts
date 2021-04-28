import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-right',
  templateUrl: './container-right.component.html',
  styleUrls: ['./container-right.component.scss']
})
export class ContainerRightComponent {

  constructor(
      private router: Router
  ) { }

  public viewAddProject() {
    if (this.router.url === '/project/add/source') {
      location.reload();
    } else {
      this.router.navigate(['project/add/source']);
    }
  }

}
