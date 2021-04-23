import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-container-right',
  templateUrl: './container-right.component.html',
  styleUrls: ['./container-right.component.scss']
})
export class ContainerRightComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public viewAddProject() {
    if (this.router.url === '/project/add/source') {
      location.reload();
    } else {
      this.router.navigate(['project/add/source']);
    }
  }

}
