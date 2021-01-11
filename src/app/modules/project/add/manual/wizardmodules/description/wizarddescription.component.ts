import { Component, OnInit } from '@angular/core';
// import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
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
import { QuillUtils } from 'src/app/utils/quill.utils';
// import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
// import { SEOService } from 'src/app/services/seo.service';
// import Stepper from 'bs-stepper';

@Component({
    selector: 'app-description',
    templateUrl: './wizarddescription.component.html',
    // styleUrls: ['../../manual.component.scss']
    styleUrls: ['../../wizardmodules/description/wizarddescription.component.scss']
})
export class DescriptionComponent implements OnInit {

    /**
       * Configuration of QuillToolbar
       */
    public modulesConfigration = QuillUtils.getDefaultModulesConfiguration();



    constructor() { }

    ngOnInit() {
    }

}
