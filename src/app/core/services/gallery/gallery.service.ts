import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { LeaguePicture } from "../../models/league-picture.model";
import {
  map,
  shareReplay,
  tap,
  switchMap,
  catchError,
  scan,
  concatMap,
  mergeMap
} from "rxjs/operators";
import { forEach } from "@angular/router/src/utils/collection";
import { v4 as uuid } from "uuid";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LeagueImageUpload } from "src/app/helpers/Constants/ThePLeagueConstants";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";

@Injectable({
  providedIn: "root"
})
export class GalleryService implements Resolve<Observable<LeaguePicture[]>> {
  private readonly galleryUrl: string = "gallery";
  defaultGalleryImage: LeaguePicture[] = [
    {
      small: "../../../../assets/default_gallery.jpg",
      medium: "../../../../assets/default_gallery.jpg",
      big: "../../../../assets/default_gallery.jpg"
    }
  ];
  leaguePicturesSubject$ = new BehaviorSubject<LeaguePicture[]>([]);
  //leaguePictures$ = this.leaguePicturesSubject$.asObservable();
  leaguePictures$: Observable<LeaguePicture[]> = new BehaviorSubject<
    LeaguePicture[]
  >([]).asObservable();
  leaguePictures: LeaguePicture[] = [];

  private addLeaguePictureAction: BehaviorSubject<
    FormData
  > = new BehaviorSubject<FormData>(null);
  private deleteLeaguePictureAction: BehaviorSubject<
    LeaguePicture[]
  > = new BehaviorSubject<LeaguePicture[]>(null);
  private updateLeaguePictureOrderAction: BehaviorSubject<
    LeaguePicture[]
  > = new BehaviorSubject<LeaguePicture[]>(null);
  private removePreviewPictureAction: BehaviorSubject<
    LeaguePicture
  > = new BehaviorSubject<LeaguePicture>(null);

  newLeaguePictures: LeaguePicture[] = [];
  uploadPicture: Subject<LeaguePicture> = new Subject<LeaguePicture>();
  leaguePicturesPreview$ = this.uploadPicture.pipe(
    scan<LeaguePicture, LeaguePicture[]>(
      (pictures: LeaguePicture[], newPicture: LeaguePicture) => {
        if (pictures.includes(newPicture)) {
          this.newLeaguePictures = pictures.filter(p => p !== newPicture);
          pictures = [...this.newLeaguePictures];
          return pictures;
        } else {
          return [...pictures, newPicture];
        }
      },
      new Array<LeaguePicture>()
    )
  );

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.leaguePictures$ = this.http.get<LeaguePicture[]>(this.galleryUrl).pipe(
      map(
        (leaguePictures: LeaguePicture[]) =>
          (this.leaguePictures = leaguePictures)
      ),
      catchError(() => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while getting gallery items. Please come back later`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
      }),
      shareReplay()
    );

    return this.leaguePictures$;
  }

  deleteLeaguePicturesLatest$ = combineLatest([
    this.deleteLeaguePictureAction,
    this.leaguePictures$
  ]).pipe(
    switchMap(
      ([leaguePicturesToDelete]: [LeaguePicture[], LeaguePicture[]]) => {
        return this.deleteLeaguePicturesAsync(leaguePicturesToDelete);
      }
    )
  );

  deleteLeaguePictures(leaguePictures: LeaguePicture[]) {
    this.deleteLeaguePictureAction.next(leaguePictures);
  }

  private deleteLeaguePicturesAsync(leaguePics: LeaguePicture[]) {
    if (leaguePics === null) {
      return of([]);
    }
    const photoString: string =
      leaguePics.length > 0 && leaguePics.length < 2 ? "photo" : "photos";
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(leaguePics.map(lp => lp.id))
    };
    return combineLatest([
      this.leaguePictures$,
      this.http.delete<boolean>(this.galleryUrl, options)
    ]).pipe(
      map(([leaguePicsAll]: [LeaguePicture[], boolean]) => {
        leaguePicsAll.map((lP: LeaguePicture) => {
          if (leaguePics.includes(lP)) {
            const delIndex = leaguePicsAll.indexOf(lP);
            leaguePicsAll.splice(delIndex, 1);
          }
        });
        return leaguePicsAll;
      }),
      tap(_ => {
        this.snackBarService.openSnackBarFromComponent(
          `Successfully deleted gallery ${photoString}`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(err => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while deleting gallery ${photoString} gear item`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
      })
    );
  }

  updatedLeaguePicturesOrder$ = combineLatest([
    this.updateLeaguePictureOrderAction,
    this.leaguePictures$
  ]).pipe(
    switchMap(
      ([updatedLeaguePictureOrder]: [LeaguePicture[], LeaguePicture[]]) => {
        return this.updateLeaguePicturesOrderAsync(updatedLeaguePictureOrder);
      }
    )
  );

  updateLeaguePicturesOrder(leaguePictures: LeaguePicture[]) {
    this.updateLeaguePictureOrderAction.next(leaguePictures);
  }

  private updateLeaguePicturesOrderAsync(
    leaguePicturesOrdered: LeaguePicture[]
  ) {
    if (leaguePicturesOrdered === null) {
      return of([]);
    }
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return combineLatest([
      this.updateLeaguePictureOrderAction,
      this.leaguePictures$
    ]).pipe(
      map(
        ([leaguePicturesOrdered, leaguePictures]: [
          LeaguePicture[],
          LeaguePicture[]
        ]) => {
          if (leaguePicturesOrdered.length != leaguePictures.length) {
            console.log(
              "The array length of ordered pictures did not match the length of existing pictures"
            );
            return leaguePictures;
          }
          // clear old array
          leaguePictures.length = 0;
          // append new contents of the new array to the old array since
          // order has changed
          leaguePictures.push.apply(leaguePictures, leaguePicturesOrdered);

          return leaguePicturesOrdered;
        }
      ),
      map(leaguePicturesOrdered => {
        // assign orderIds to persist the order
        for (let index = 0; index < leaguePicturesOrdered.length; index++) {
          let leaguePicture = leaguePicturesOrdered[index];
          leaguePicture.orderId = index + 1;
        }
        return leaguePicturesOrdered;
      }),
      mergeMap(leaguePicturesOrdered => {
        return this.http.post<LeaguePicture[]>(
          `${this.galleryUrl}/order`,
          JSON.stringify(leaguePicturesOrdered),
          headers
        );
      })
    );
  }

  removePreview(leaguePicture: LeaguePicture) {
    this.removePreviewPictureAction.next(leaguePicture);
  }

  newLatestLeaguePictures$ = combineLatest([
    this.addLeaguePictureAction,
    this.leaguePictures$
  ]).pipe(
    switchMap(([newLeaguePicture]: [FormData, LeaguePicture[]]) => {
      return this.createLeagueImagesAsync(newLeaguePicture);
    })
  );

  createLeagueImages(leaguePictures: FormData) {
    this.addLeaguePictureAction.next(leaguePictures);
  }

  private createLeagueImagesAsync(
    newLeaguePictures: FormData
  ): Observable<LeaguePicture[]> {
    if (newLeaguePictures === null) {
      return of([]);
    }
    return combineLatest([
      this.leaguePictures$,
      this.http.post<LeaguePicture[]>(`${this.galleryUrl}`, newLeaguePictures)
    ]).pipe(
      map(
        ([existingLeagueImages, newLeagueImages]: [
          LeaguePicture[],
          LeaguePicture[]
        ]) => {
          for (let index = 0; index < newLeagueImages.length; index++) {
            const newImage = newLeagueImages[index];
            existingLeagueImages.unshift(newImage);
          }
          return existingLeagueImages;
        }
      ),
      // This tap is necessary to clear the preview list after successful upload
      // we have to re-emit each uploaded picture because in the leaguePicturesPreview$
      // we have logic to check if the item being emitted
      // exists in the array, if it does remove it, if it doesn't add it
      tap(_ => {
        this.newLeaguePictures.forEach((leaguePicture: LeaguePicture) => {
          this.uploadPicture.next(leaguePicture);
        });
      }),
      tap(_ => {
        this.snackBarService.openSnackBarFromComponent(
          "Successfully created gallery photo",
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(() => {
        this.snackBarService.openSnackBarFromComponent(
          "Error occured while creating gallery photo",
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
      })
    );
  }
}

export const leaguePicturesConst: LeaguePicture[] = [
  {
    url: "../../../assets/p_league_1.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p_league_1.JPG",
    medium: "../../../assets/p_league_1.JPG",
    big: "../../../assets/p_league_1.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-2.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-2.JPG",
    medium: "../../../assets/p-league-2.JPG",
    big: "../../../assets/p-league-2.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-3.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-3.JPG",
    medium: "../../../assets/p-league-3.JPG",
    big: "../../../assets/p-league-3.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-4.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-4.JPG",
    medium: "../../../assets/p-league-4.JPG",
    big: "../../../assets/p-league-4.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-4.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-4.JPG",
    medium: "../../../assets/p-league-4.JPG",
    big: "../../../assets/p-league-4.JPG",
    id: uuid(),
    size: 1,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-3.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-3.JPG",
    medium: "../../../assets/p-league-3.JPG",
    big: "../../../assets/p-league-3.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-4.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-4.JPG",
    medium: "../../../assets/p-league-4.JPG",
    big: "../../../assets/p-league-4.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  },
  {
    url: "../../../assets/p-league-4.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p-league-4.JPG",
    medium: "../../../assets/p-league-4.JPG",
    big: "../../../assets/p-league-4.JPG",
    id: uuid(),
    size: 0,
    type: "jpg"
  }
];
