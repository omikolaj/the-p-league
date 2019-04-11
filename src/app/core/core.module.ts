import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
