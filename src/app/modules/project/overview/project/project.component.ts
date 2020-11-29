import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() showListView: boolean;
  @Input() project: Project;
  @Output() projectClicked = new EventEmitter<Project>();

  constructor(
      private fileRetrieverService: FileRetrieverService) {
  }

  ngOnInit(): void {
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }

  public onProjectClick(project) {
    this.projectClicked.emit(project);
  }

}
