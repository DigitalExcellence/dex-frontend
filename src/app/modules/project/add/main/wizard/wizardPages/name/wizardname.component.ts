import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { DataService } from '../../../../data.service';

@Component({
    selector: 'app-name',
    templateUrl: './wizardname.component.html',
  styleUrls: ['./wizardname.component.scss']
})

// let projectName = (document.getElementById("name") as HTMLInputElement).value;

export class ProjectNameComponent implements OnInit {

    project: Project;
    subscription: Subscription;
    linkForm: FormControl;

    constructor(private dataService: DataService) {
        this.linkForm = new FormControl('');
    }

    ngOnInit() {
      this.subscription = this.dataService.currentProject.subscribe((message: Project) => {
        this.project = message;
        this.linkForm.patchValue(message.name);
      });
    }

    onClickNextButton() {
        this.project.name = this.linkForm.value;
        this.dataService.updateProject(this.project);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSubmit() {
        return false;
    }

}
