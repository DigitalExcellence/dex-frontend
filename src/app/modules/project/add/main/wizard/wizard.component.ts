import { Component, Input, OnInit } from '@angular/core';
import { ExternalSource } from 'src/app/models/domain/external-source';
import { WizardService } from 'src/app/services/wizard.service';
import { WizardPageService } from 'src/app/services/wizard-page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  @Input() selectedExternalSource: ExternalSource;

  modalRef: BsModalRef;
  url: string;
  stepLinks = ['/username', '/step2', '/step3', '/step4'];
  isModalShown = true;

  constructor(private wizardService: WizardService,
              private wizardPageService: WizardPageService,
              private router: Router,
              private location: Location,
              private modalService: BsModalService,
              private route: ActivatedRoute) {
    this.router.events.subscribe((url: any) => {this.url = url;});
  }

  ngOnInit(): void {
    this.selectedExternalSource.wizardPages.push();
    //this.router.navigate(['project', 'add', 'wizard', this.selectedExternalSource.wizardPages[0].name])
  }

  public nextLink(): string {
    const index = this.stepLinks.indexOf(this.url);
    return `${this.location.path()}/${this.stepLinks[index + 1]}`;
  }

  public previousLink(): string {
    const index = this.stepLinks.indexOf(this.url);
    return `${this.location.path()}/${this.stepLinks[index + 1]}`;
  }

  onHidden() {

  }
}
