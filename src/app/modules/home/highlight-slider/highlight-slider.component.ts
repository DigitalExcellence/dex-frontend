import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-highlight-slider',
  templateUrl: './highlight-slider.component.html',
  styleUrls: ['./highlight-slider.component.scss']
})
export class HighlightSliderComponent implements OnInit {

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

  public viewAddProject() {
    if (this.router.url === '/project/add/source') {
      location.reload();
    } else {
      this.router.navigate(['project/add/source']);
    }
  }

}
