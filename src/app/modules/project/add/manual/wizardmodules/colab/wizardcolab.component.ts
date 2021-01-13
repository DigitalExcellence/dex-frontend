/*
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { DataService } from "../../../data.service";


@Component({
    selector: 'app-colab',
    templateUrl: './wizardcolab.component.html',
    styleUrls: ['../../wizardmodules/colab/wizardcolab.component.scss']
})
export class ColabComponent implements OnInit {

    project: Project;
    subscription: Subscription;
    linkForm: FormControl;

    constructor(private dataService: DataService) {
        this.linkForm = new FormControl('');
    }

    ngOnInit() {
        this.subscription = this.dataService.currentProject.subscribe((message: Project) => {
            this.project = message;
            this.linkForm.patchValue(message.collaborators);
            console.log("🧀 " + message.collaborators)
        })
    }

    onClickNextButton() {
        this.project.collaborators = this.linkForm.value;
        this.dataService.updateProject(this.project);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    onSubmit() {
        return false;
    }

}
