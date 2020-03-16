import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { SourceComponent } from './source/source.component';
import { ManualComponent } from './manual/manual.component';


@NgModule({
  declarations: [SourceComponent, ManualComponent],
  imports: [
    CommonModule,
    AddRoutingModule
  ]
})
export class AddModule { }
