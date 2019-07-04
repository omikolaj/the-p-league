import { Injectable } from "@angular/core";
import { switchMap, catchError, tap } from "rxjs/operators";
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
    this.loadingSubject.next(true);
    return this.http
      .post<PreOrderForm>(
        `${this.merchandiseUrl}/${preOrderForm.gearItemId}/pre-order`,
        JSON.stringify(preOrderForm),
        this.headers
      )
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError(err => {
          this.loadingSubject.next(false);
          this.snackBarService.openSnackBarFromComponent(
            "Error occured submitting the pre-order",
            "Dismiss",
            SnackBarEvent.Error
          );
          return of(null);
        })
      );
  }
}
