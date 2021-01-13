import { QuillUtils } from 'src/app/utils/quill.utils';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { DataService } from "../../../data.service";

@Component({
    selector: 'app-description',
    templateUrl: './wizarddescription.component.html',
    styleUrls: ['../../wizardmodules/description/wizarddescription.component.scss']
})
export class DescriptionComponent implements OnInit {


    project: Project;
    subscription: Subscription;
    linkForm: FormControl;
    linkForm2: FormControl;

    constructor(private dataService: DataService) {
        this.linkForm = new FormControl('');
        this.linkForm2 = new FormControl('');
    }

    ngOnInit() {
        this.subscription = this.dataService.currentProject.subscribe((message: Project) => {
            this.project = message;
            this.linkForm.patchValue(message.shortDescription);
            this.linkForm2.patchValue(message.description);
            console.log("Short: " + message.shortDescription + "    Long: " + message.description)
        })
    }

    onClickNextButton() {
        this.project.shortDescription = this.linkForm.value;
        this.project.description = this.linkForm2.value;
        this.dataService.updateProject(this.project);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    onSubmit() {
        return false;
    }

}
