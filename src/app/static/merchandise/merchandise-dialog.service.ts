import { Injectable } from '@angular/core';
import { MerchandiseDialogComponent } from './merchandise-dialog-container/merchandise-dialog/merchandise-dialog.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class MerchandiseDialogService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  openMerchandiseDialog(dialog: MatDialog): void{
    const dialogRef = dialog.open(MerchandiseDialogComponent, {
      width: '375px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['merchandise'], { relativeTo: this.route })
    })
  }
}
