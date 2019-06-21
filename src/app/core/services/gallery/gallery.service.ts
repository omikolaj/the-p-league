import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject, combineLatest } from "rxjs";
import { LeaguePicture } from "../../models/league-picture.model";
import { map, shareReplay, tap } from "rxjs/operators";
import { forEach } from "@angular/router/src/utils/collection";
import { v4 as uuid } from "uuid";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LeagueImageUpload } from "src/app/helpers/Constants/ThePLeagueConstants";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

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
  leaguePictures$: Observable<LeaguePicture[]>;
  leaguePictures: LeaguePicture[] = [];

  constructor(private http: HttpClient) {
    //this.leaguePictures$ = of(leaguePictures);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return (this.leaguePictures$ = this.http
      .get<LeaguePicture[]>(this.galleryUrl)
      .pipe(
        tap(leaguePictures => this.leaguePicturesSubject$.next(leaguePictures)),
        map((leaguePictures: LeaguePicture[]) =>
          (this.leaguePictures = leaguePictures).reverse()
        ),
        shareReplay()
      ));
  }

  fetchAllLeaguePictures(): Observable<LeaguePicture[]> {
    return this.leaguePictures$;
  }

  removeLeaguePictures(leaguePics: LeaguePicture[]) {
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
      tap(updatedLeaguePics =>
        this.leaguePicturesSubject$.next(updatedLeaguePics)
      )
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

  saveLeaguePictures(newLeaguePictures: FormData): Observable<LeaguePicture[]> {
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
      tap(updatedLeagueImages =>
        this.leaguePicturesSubject$.next(updatedLeagueImages)
      )
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
