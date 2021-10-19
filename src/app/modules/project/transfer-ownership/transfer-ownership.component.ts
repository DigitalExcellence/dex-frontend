import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit {

  private transferGuid;
  private isOwnerMail;
  private acceptedRequest;

  public reply = '';
  public replyStatus: number;
  public isLoading = true;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) {
    this.transferGuid = this.route.snapshot.url[1];
    this.isOwnerMail = this.route.snapshot.url[2];
    this.acceptedRequest = this.route.snapshot.url[3];
  }

  ngOnInit(): void {
    this.projectService.processTransferProjectOwnership(this.transferGuid, this.isOwnerMail, this.acceptedRequest).subscribe(response => {
      this.reply = response.body;
      this.replyStatus = response.status;
      this.isLoading = false;
    }, (error: HttpErrorResponse) => {
      this.reply = error.message;
      this.replyStatus = error.status;
    });
  }
}
