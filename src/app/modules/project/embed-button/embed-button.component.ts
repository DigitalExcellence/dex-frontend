import { EmbedService } from './../../../services/embed.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmbeddedProject } from 'src/app/models/domain/embedded-project';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-embed-button',
  templateUrl: './embed-button.component.html',
  styleUrls: ['./embed-button.component.scss']
})
/**
 * Button that generates an embedded project and creates an iframe example link
 */
export class EmbedButtonComponent implements OnInit {
  EmbeddedProject: EmbeddedProject;
  frontendUrl = environment.frontendUrl;

  private ProjectId: number;

  constructor(private activedRoute: ActivatedRoute, private EmbedService: EmbedService) { }


  ngOnInit() {
    const routeId = this.activedRoute.snapshot.paramMap.get("id");
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id < 1) {
      return;
    }
    this.ProjectId = id;
  }

  generateEmbed(){
    this.EmbedService.post({ProjectId:this.ProjectId})
      .subscribe(
        (result) => {
          this.EmbeddedProject = result;
        },
        (error: HttpErrorResponse) => {
          //handle error
        }
      );
  }
}
