import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { LeaguePicture } from "../../models/leage-picture.model";
import { map } from "rxjs/operators";
import { forEach } from "@angular/router/src/utils/collection";

@Injectable({
  providedIn: "root"
})
export class GalleryService {
  leaguePicturesSubject$ = new BehaviorSubject<LeaguePicture[]>(leaguePictures);
  leaguePictures$: Observable<LeaguePicture[]>;
  constructor() {
    this.leaguePictures$ = of(leaguePictures);
  }

  fetchAllLeaguePictures(): Observable<LeaguePicture[]> {
    return this.leaguePictures$;
  }

  removeLeaguePictures(
    leaguePics: LeaguePicture[]
  ): Observable<LeaguePicture[]> {
    let leaguePicturesUpdated: LeaguePicture[];
    let picsToRemove: LeaguePicture[] = [];
    return this.leaguePictures$.pipe(
      map((leaguePicsAll: LeaguePicture[]) => {
        const copyLeaeguePicsAll = [...leaguePicsAll];
        leaguePicturesUpdated = copyLeaeguePicsAll.filter(
          (lP: LeaguePicture) => {
            if (leaguePics.includes(lP)) {
              const delIndex = leaguePicsAll.indexOf(lP);
              leaguePicsAll.splice(delIndex, 1);
            } else {
              return true;
            }
          }
        );
        this.leaguePicturesSubject$.next(leaguePicturesUpdated);
        return leaguePicturesUpdated;
      })
    );
  }

  updateLeaguePicturesOrder(
    leaguePicturesOrdered: LeaguePicture[]
  ): Observable<LeaguePicture[]> {
    return this.leaguePictures$.pipe(
      map((leaguePictures: LeaguePicture[]) => {
        if (leaguePicturesOrdered.length != leaguePictures.length) {
          console.log(
            "The array length of ordered pictures did not match the length of existing pictures"
          );
          this.leaguePicturesSubject$.next(leaguePictures);
          return leaguePictures;
        }
        this.leaguePicturesSubject$.next(leaguePicturesOrdered);
        return (leaguePictures = leaguePicturesOrdered);
      })
    );
  }
}

export const leaguePictures: LeaguePicture[] = [
  {
    url: "../../../assets/p_league_1.JPG",
    name: "test",
    hashTag: "boom",
    delete: false,
    small: "../../../assets/p_league_1.JPG",
    medium: "../../../assets/p_league_1.JPG",
    big: "../../../assets/p_league_1.JPG",
    ID: "1",
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
    ID: "1",
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
    ID: "1",
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
    ID: "1",
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
    ID: "1",
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
    ID: "1",
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
    ID: "1",
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
    ID: "1",
    size: 0,
    type: "jpg"
  }
];
