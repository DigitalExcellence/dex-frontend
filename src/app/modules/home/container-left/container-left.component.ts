import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-container-left',
  templateUrl: './container-left.component.html',
  styleUrls: ['./container-left.component.scss']
})
export class ContainerLeftComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public viewAllProjects() {
    if (this.router.url === '/project/overview') {
      location.reload();
    } else {
      this.router.navigate(['project/overview']);
    }
  }

}
