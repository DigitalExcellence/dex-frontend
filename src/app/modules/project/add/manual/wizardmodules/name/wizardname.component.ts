import { ManualComponent } from './../../manual.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
// import { EventEmitter } from 'protractor';
// import { AlertType } from 'src/app/models/internal/alert-type';
// import { AlertConfig } from 'src/app/models/internal/alert-config';
// import { AlertService } from 'src/app/services/alert.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { finalize } from 'rxjs/operators';
// import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
// import { ProjectAdd } from 'src/app/models/resources/project-add';
// import { ProjectService } from 'src/app/services/project.service';
// import { MappedProject } from 'src/app/models/internal/mapped-project';
// import { WizardService } from 'src/app/services/wizard.service';
// import { QuillUtils } from 'src/app/utils/quill.utils';
// import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
// import { SEOService } from 'src/app/services/seo.service';
// import Stepper from 'bs-stepper';

@Component({
    selector: 'app-name',
    templateUrl: './wizardname.component.html',
    // styleUrls: ['../../manual.component.scss']
    styleUrls: ['../../wizardmodules/name/wizardname.component.scss']
})

// let projectName = (document.getElementById("name") as HTMLInputElement).value;

export class ProjectNameComponent implements OnInit {


    // message: string = projectName;
    // @Output() MessageEvent = new EventEmitter<string>();




    constructor() { }

    ngOnInit() {
    }

    // sendMessage() {
    //     this.MessageEvent.emit(this.message)
    // }



}
