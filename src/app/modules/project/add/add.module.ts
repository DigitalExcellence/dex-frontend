import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { SourceComponent } from './source/source.component';
import { ManualComponent } from './manual/manual.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';


@NgModule({
  declarations: [SourceComponent, ManualComponent],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    ClarityModule
  ]
})
export class AddModule { }
