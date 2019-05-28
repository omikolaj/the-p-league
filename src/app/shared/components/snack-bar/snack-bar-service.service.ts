import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { Component } from "@angular/compiler/src/core";
import { ComponentType } from "@angular/core/src/render3";
import { Subject } from "rxjs";
import { SnackBarComponent } from "./snack-bar.component";

@Injectable({
  providedIn: "root"
})
export class SnackBarService {
  private successConfig: MatSnackBarConfig = {
    panelClass: ["style-success"],
    horizontalPosition: "center",
    verticalPosition: "bottom"
  };

  private errorConfig: MatSnackBarConfig = {
    panelClass: ["style-error"],
    horizontalPosition: "center",
    verticalPosition: "bottom"
  };

  constructor(private snackBar: MatSnackBar) {}

  openSnackBarFromComponent(
    message: string,
    action: string,
    event: SnackBarEvent
  ) {
    const data = {
      message: message,
      action: action
    };

    switch (event) {
      case SnackBarEvent.Success:
        this.successConfig.data = data;
        this.snackBar.openFromComponent(SnackBarComponent, this.successConfig);
        break;

      case SnackBarEvent.Error:
        this.errorConfig.data = data;
        this.snackBar.openFromComponent(SnackBarComponent, this.errorConfig);
        break;

      case SnackBarEvent.Warning:
        break;

      default:
        break;
    }
  }
}

export enum SnackBarEvent {
  Success,
  Error,
  Warning
}
