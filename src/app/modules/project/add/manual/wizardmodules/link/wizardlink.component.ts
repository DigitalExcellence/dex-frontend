import { Component, OnInit } from '@angular/core';
// import { ManualComponent } from './../../manual.component';
import { DataService } from "../../../data.service";
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-link',
    template: '(done)="collectData($event)',
    templateUrl: './wizardlink.component.html',
    // styleUrls: ['../../manual.component.scss']
    styleUrls: ['../../wizardmodules/link/wizardlink.component.scss'],
})

export class LinkComponent implements OnInit {

    // message: string;
    // subscription: Subscription;

    constructor(private dataService: DataService) { }
    // constructor() { }

    ngOnInit() {
        // this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
    }

    // ngOnDestroy() {
    //     this.subscription.unsubscribe();
    // }

    collectData(data: any): void {
        this.dataService.replaceLink(data);
    }

}

