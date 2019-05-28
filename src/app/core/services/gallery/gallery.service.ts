import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { LeaguePicture } from "../../models/leage-picture.model";
import { map } from "rxjs/operators";
import { forEach } from "@angular/router/src/utils/collection";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root"
})
export class GalleryService {
  defaultGalleryImage: LeaguePicture[] = [
    {
      small: "../../../../assets/default_gallery.jpg",
      medium: "../../../../assets/default_gallery.jpg",
      big: "../../../../assets/default_gallery.jpg"
    }
  ];
  leaguePicturesSubject$ = new BehaviorSubject<LeaguePicture[]>(leaguePictures);
  leaguePictures$ = this.leaguePicturesSubject$.asObservable();
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

        // If all images were deleted simply render the default image
        if (leaguePicturesUpdated.length === 0) {
          leaguePicturesUpdated = this.defaultGalleryImage;
        }

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

  saveLeaguePictures(
    newLeaguePictures: LeaguePicture[]
  ): Observable<LeaguePicture[]> {
    return this.leaguePictures$.pipe(
      map((leaguePictures: LeaguePicture[]) => {
        const updatedArr: LeaguePicture[] = newLeaguePictures.concat(
          leaguePictures
        );
        this.leaguePicturesSubject$.next(updatedArr);
        return updatedArr;
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
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
    ID: uuid(),
    size: 0,
    type: "jpg"
  }
];
