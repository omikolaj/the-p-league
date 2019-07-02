import { Injectable } from "@angular/core";
import { switchMap, catchError } from "rxjs/operators";
import { PreOrderForm } from "../../models/merchandise/pre-order-form.model";
import { Observable, of, BehaviorSubject, Subject } from "rxjs";
import {
  SnackBarEvent,
  SnackBarService
} from "src/app/shared/components/snack-bar/snack-bar-service.service";
import { MerchandiseService } from "../merchandise/merchandise.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventBusService } from "../event-bus/event-bus.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PreOrderService extends MerchandiseService {
  private preOrderAction: Subject<PreOrderForm> = new Subject<PreOrderForm>();

  preOrder$ = this.preOrderAction.asObservable().pipe(
    switchMap((preOrderForm: PreOrderForm) => {
      console.log("PreORderTriggered");
      return this.preOrderGearItemAsync(preOrderForm);
    })
  );

  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(
    http: HttpClient,
    snackBar: SnackBarService,
    eventBus: EventBusService,
    router: Router
  ) {
    super(http, snackBar, eventBus, router);
  }

  preOrderGearItem(preOrderForm: PreOrderForm) {
    this.preOrderAction.next(preOrderForm);
  }

  private preOrderGearItemAsync(
    preOrderForm: PreOrderForm
  ): Observable<PreOrderForm> {
    console.log("PreOrder Form is", preOrderForm);
    return this.http
      .post<PreOrderForm>(
        `${this.merchandiseUrl}/${preOrderForm.gearItemId}/pre-order`,
        JSON.stringify(preOrderForm),
        this.headers
      )
      .pipe(
        catchError(err => {
          this.snackBarService.openSnackBarFromComponent(
            "Error occured while submitting pre-order form",
            "Dismiss",
            SnackBarEvent.Error
          );
          return of(null);
        })
      );
  }
}
