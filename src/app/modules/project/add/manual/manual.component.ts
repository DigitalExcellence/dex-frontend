import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {

  public newProjectForm: FormGroup;

  private contributors: string[];

  constructor(private formBuilder: FormBuilder) {
    this.newProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null, Validators.required],
      shortDescription: [null, Validators.required],
      description: [null, null]
    });
  }

  ngOnInit(): void {
  }

  public onSubmit() {

  }

  public onAddContributor() {

  }
}
