import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent implements OnInit {

  @Input() showListView: boolean;
  @Input() project: Project;

  constructor(
      private fileRetrieverService: FileRetrieverService) {
  }

  ngOnInit(): void {
    console.log(this.project);
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }

  public tagClicked(event) {
    event.stopPropagation();
  }

  public userClicked(event) {
    event.stopPropagation();
  }
}
