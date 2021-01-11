// import { DataService } from './data.service';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable()
// export class DataService {

//     private messageSource = new BehaviorSubject('default message');
//     currentMessage = this.messageSource.asObservable();

//     constructor() { }

//     changeMessage(message: string) {
//         this.messageSource.next(message)
//     }

// }

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    link = "link";
    name = "name";
    shDe = "short description";
    loDe = "long description";
    collab = [];

    data: any[] = [this.link, this.name, this.shDe, this.loDe, this.collab];

    constructor() { }

    // addItem(item: any): void {
    //     this.data.push(item);
    // }

    // addItem(item: any): void {
    //     // this is one generic way of cloning an object; the gist: don't push `item`, push its copy
    //     this.data.push(JSON.parse(JSON.stringify(item)));
    // }


    replaceName(item: any): void {
        this.name = item;
    }

    replaceLink(item: any): void {
        this.link = item;
    }

    replaceShort(item: any): void {
        this.shDe = item;
    }

    replaceLong(item: any): void {
        this.loDe = item;
    }

    addCollab(item: any): void {
        item.forEach(item => {
            this.collab.push();
        });
    }

    downloadData(): void {
        console.log('data', this.data);
    }

}