import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Module in which reusable components and modules can be imported and exported.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ReactiveFormsModule
  ]
})
export class SharedModule { }
