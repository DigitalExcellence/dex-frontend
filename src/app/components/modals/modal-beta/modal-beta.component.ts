import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-beta',
  templateUrl: './modal-beta.component.html',
  styleUrls: ['./modal-beta.component.scss']
})
export class ModalBetaComponent implements OnInit {

  public readonly dexGithubIssueUrl = 'https://github.com/DigitalExcellence/dex-frontend/issues';

  constructor() { }

  ngOnInit(): void {
  }

}
