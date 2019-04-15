import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LeaguePicture } from '../../models/leage-picture.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  fetchAllLeaguePictures(): Observable<LeaguePicture[]>{
    return of([
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
      { URL: '../../../../assets/default_gallery.jpg',  name: 'swoosh', hashTag: 'sharpShooter', cols: 2, rows: 3},
    ])
  }
}
