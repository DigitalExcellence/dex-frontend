import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { DataService } from "../../../data.service";

@Component({
    selector: 'app-final',
    templateUrl: './wizardfinal.component.html',
    styleUrls: ['../../manual.component.scss']
})
export class FinalComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }


    onSubmit() {
        return false;
    }

}


