import { Injectable } from "@angular/core";
import { MerchandiseDialogComponent } from "./merchandise-dialog/merchandise-dialog.component";
import { MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable()
export class MerchandiseDialogService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  openMerchandiseDialog(dialog: MatDialog): void {
    const dialogRef = dialog.open(MerchandiseDialogComponent, {
      width: "90%",
      maxWidth: "450px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["merchandise"], { relativeTo: this.route });
    });
  }
}
