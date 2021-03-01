import { Component, OnInit } from '@angular/core';

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


