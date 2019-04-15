import { Component, OnInit } from '@angular/core';
import { MerchandiseDialogService } from '../merchandise-dialog.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-merchandise-dialog-container',
  templateUrl: './merchandise-dialog-container.component.html',
  styleUrls: ['./merchandise-dialog-container.component.scss']
})
export class MerchandiseDialogContainerComponent implements OnInit {

  constructor(
    private merchandiseDialogService: MerchandiseDialogService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // We are using setTimeout to defer this code to another JavaScript Virtual Machine turn. 
    // This avoids the error in development "Expression has changed after it was checked".
    setTimeout(() => {
      this.merchandiseDialogService.openMerchandiseDialog(this.dialog);
    })    
  }

}
