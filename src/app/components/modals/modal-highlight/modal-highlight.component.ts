import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectAdd } from '../../../models/resources/project-add';
import { finalize } from 'rxjs/operators';
import { HighlightAdd } from '../../../models/resources/highlight-add';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-highlight.component.html',
  styleUrls: ['./modal-highlight.scss']
})
export class ModalHighlightComponent implements OnInit {

  @Output() confirm = new EventEmitter();

  public highlightProjectForm: FormGroup;
  public dateFieldsEnabled = true;
  public dateErrorMessage: string = null;

  constructor(
      public bsModalRef: BsModalRef,
      private formBuilder: FormBuilder,
  ) {
    this.highlightProjectForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      indeterminate: [false],
    });
    this.highlightProjectForm.get('indeterminate').valueChanges.subscribe(value => {
      this.onChangeCheckbox(value);
    })
  }

  ngOnInit(): void {

  }

  /**
   * This method disables the start date and end date fields when the indeterminate checkbox is checked.
   * @param checked
   */
  public onChangeCheckbox(checked: boolean): void{
    if(checked){
      this.highlightProjectForm.get('startDate').disable();
      this.highlightProjectForm.get('endDate').disable();
    }else{
      this.highlightProjectForm.get('startDate').enable();
      this.highlightProjectForm.get('endDate').enable();
    }

  }
  /**
   * Method which triggers when the confirm button is clicked. On confirm highlight form values are checked.
   * Error message is shown if the form fields are empty.
   * Error message is shown if the start date later than the end date.
   */
  public onClickConfirm(): void {
    const highlightAddResource : HighlightAdd = this.highlightProjectForm.value;
    if((highlightAddResource.startDate == null || highlightAddResource.endDate == null) && this.highlightProjectForm.value.indeterminate === false){
      this.dateErrorMessage = "Error: Fill in a start and end date or choose never ending";
      return;
    }
    if(highlightAddResource.startDate > highlightAddResource.endDate || highlightAddResource.endDate < highlightAddResource.startDate){
      this.dateErrorMessage = "Error: Start date can't be later than end date";
      return;
    }
    this.confirm.emit(this.highlightProjectForm.value);
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the deny button is clicked.
   */
  public onClickDeny(): void {
    this.bsModalRef.hide();
  }
}
