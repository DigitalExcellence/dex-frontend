import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pick-flow-page',
  templateUrl: './pick-flow-page.component.html',
  styleUrls: ['./pick-flow-page.component.scss']
})
export class PickFlowPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  buttonClicked(event: MouseEvent, type) {
    if (type === 'public') {
      console.log('public flow');
    } else if (type === 'private') {
      console.log('private');
    } else {
      console.error('Unkown type');
    }
  }

}
