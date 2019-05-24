import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { LeaguePicture } from "src/app/core/models/leage-picture.model";
import {
  GalleryService,
  leaguePictures
} from "src/app/core/services/gallery/gallery.service";
import {
  CdkDropListGroup,
  CdkDropList,
  CdkDropListContainer,
  moveItemInArray,
  CdkDrag,
  CdkDragMove
} from "@angular/cdk/drag-drop";
import { map, filter } from "rxjs/operators";
import { Observable } from "rxjs";
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatCheckboxChange } from "@angular/material";

@Component({
  selector: "app-admin-control",
  templateUrl: "./admin-control.component.html",
  styleUrls: ["./admin-control.component.scss"]
})
export class AdminControlComponent implements OnInit {
  //#region DragAndDrop Properties
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;
  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  //#endregion

  @Input("images") galleryImages: LeaguePicture[];
  panelOpenState = false;

  constructor(
    private viewportRuler: ViewportRuler,
    private galleryService: GalleryService
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {
    this.galleryService.leaguePicturesSubject$.pipe(
      map((updatedPhotos: LeaguePicture[]) => {
        console.log("ON SUBJECT NEXT", updatedPhotos);
        return (this.galleryImages = updatedPhotos);
      })
    );
  }

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = "none";
    phElement.parentElement.removeChild(phElement);
  }

  onChange(event: MatCheckboxChange, index: number) {
    console.log("Checkbox change", event, index);
    const galleryImagesUpdated = [...this.galleryImages];
    galleryImagesUpdated[index].delete = event.checked;
    this.galleryImages = galleryImagesUpdated;
  }

  onChangeOrder() {
    this.galleryService
      .updateLeaguePicturesOrder(this.galleryImages)
      .subscribe();
  }

  onDelete(): void {
    const photosToDelete: LeaguePicture[] = this.galleryImages.filter(
      (lP: LeaguePicture) => lP.delete === true
    );
    this.galleryService
      .removeLeaguePictures(photosToDelete)
      .subscribe(updatedPhotos => {
        this.galleryImages = [...updatedPhotos];
        console.log("ON SUBSCRIBED", updatedPhotos);
      });
  }

  onUploadPhotos() {}

  onSave() {}

  // add() {
  //   this.items.push(this.items.length + 1);
  // }

  // shuffle() {
  //   this.galleryImages.sort(function() {
  //     return 0.5 - Math.random();
  //   });
  // }

  //#region Drag and Drop methods

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped() {
    if (!this.target) return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = "none";

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex) {
      moveItemInArray(this.galleryImages, this.sourceIndex, this.targetIndex);
      this.onChangeOrder();
    }
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder) return true;

    if (drop != this.activeContainer) return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement
    );
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + "px";
      phElement.style.height = sourceElement.clientHeight + "px";

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = "";
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    this.placeholder.enter(
      drag,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop
    );
    return false;
  };

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event)
      ? event.touches[0] || event.changedTouches[0]
      : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }
  //#endregion
}

//#region Drag and Drop functions
function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith("touch");
}

function __isInsideDropListClientRect(
  dropList: CdkDropList,
  x: number,
  y: number
) {
  const {
    top,
    bottom,
    left,
    right
  } = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}

//#endregion Drag and Drop functions

//   @Input("images") galleryImages: LeaguePicture[];
//   panelOpenState = false;

//   constructor(private galleryService: GalleryService) {}

//   ngOnInit() {
//     this.galleryService.leaguePicturesSubject$.pipe(
//       map((updatedPhotos: LeaguePicture[]) => {
//         console.log("ON SUBJECT NEXT", updatedPhotos);
//         return (this.galleryImages = updatedPhotos);
//       })
//     );
//   }

//   onDelete(): void {
//     const photosToDelete: LeaguePicture[] = this.galleryImages.filter(
//       (lP: LeaguePicture) => lP.delete === true
//     );
//     this.galleryService
//       .removeLeaguePictures(photosToDelete)
//       .subscribe(updatedPhotos => {
//         this.galleryImages = [...updatedPhotos];
//         console.log("ON SUBSCRIBED", updatedPhotos);
//       });
//   }
// }
