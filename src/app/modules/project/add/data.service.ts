import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from 'src/app/models/domain/project';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private projectSource = new BehaviorSubject(new Project());
  currentProject = this.projectSource.asObservable();

  constructor() { }

  // Update the project source observable with the new project
  updateProject(project: Project): void {
    this.projectSource.next(project);
  }

}
