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
import { map, filter, buffer, concatMap, scan, flatMap } from "rxjs/operators";
import {
  Observable,
  Subject,
  Subscribable,
  Subscription,
  concat,
  merge,
  BehaviorSubject
} from "rxjs";
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatCheckboxChange } from "@angular/material";
import { v4 as uuid } from "uuid";

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

  selectedImagesFormDate: FormData = new FormData();
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
          console.log("inside of else block");
          return [...pictures, newPicture];
        }
        // console.log("Pictures is", pictures);
        // console.log("NewPicture is", newPicture);
        // return pictures.includes(newPicture)
        //   ? pictures.filter(p => p !== newPicture)
        //   : [...pictures, newPicture];
      },
      new Array<LeaguePicture>()
    )
  );

  // fileUploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  // fileUpload$ = this.fileUploadProgress.pipe(
  //   map((num: number) => {
  //     const perc: number = 100 / num;
  //     return perc;
  //   })
  // );
  // uploadProgress: number = 0;

  loading: boolean = false;

  subscriptions: Subscription = new Subscription();
  fileReaders: FileReader[] = [];

  constructor(
    private viewportRuler: ViewportRuler,
    private galleryService: GalleryService
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = "none";
    phElement.parentElement.removeChild(phElement);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.fileReaders.forEach(fR => fR.abort());
  }

  uploadPreview(leaguePictues: LeaguePicture[]) {}

  onChange(event: MatCheckboxChange, index: number) {
    console.log("Checkbox change", event, index);
    const galleryImagesUpdated = [...this.galleryImages];
    galleryImagesUpdated[index].delete = event.checked;
    this.galleryImages = galleryImagesUpdated;
  }

  onChangeOrder() {
    this.subscriptions.add(
      this.galleryService
        .updateLeaguePicturesOrder(this.galleryImages)
        .subscribe()
    );
  }

  onDelete(): void {
    const photosToDelete: LeaguePicture[] = this.galleryImages.filter(
      (lP: LeaguePicture) => lP.delete === true
    );
    this.galleryService
      .removeLeaguePictures(photosToDelete)
      .subscribe(updatedPhotos => {
        this.galleryImages = [...updatedPhotos];
      });
  }

  onImagesSelected(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.loading = true;
    }
    const checkIfStillLoading = index => {
      if (index === fileList.length - 1) {
        this.loading = false;
      }
    };

    for (let index = 0; index < fileList.length; index++) {
      let uploadPicture: LeaguePicture = {
        preview: {
          file: fileList[index],
          error: false
        }
      };

      const newLeaguePicture: LeaguePicture = {
        ID: uuid(),
        name: uploadPicture.preview.file.name,
        size: uploadPicture.preview.file.size,
        type: uploadPicture.preview.file.type,
        big: "../../../../assets/default_gallery.jpg",
        medium: "../../../../assets/default_gallery.jpg",
        small: "../../../../assets/default_gallery.jpg"
      };

      this.newLeaguePictures.push(newLeaguePicture);

      const mimeType = uploadPicture.preview.file.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("[Invalid Image]");
        uploadPicture.preview.error = true;
        uploadPicture.preview.message = "Only images are supported.";
        uploadPicture.preview.src = "../../../../assets/warning.jpg";
        this.uploadPicture.next(uploadPicture);
        checkIfStillLoading(index);
        continue;
      }

      const reader: FileReader = new FileReader();
      this.fileReaders.push(reader);
      reader.readAsDataURL(uploadPicture.preview.file);
      reader.onload = (event: any) => {
        uploadPicture.preview.src = event.target.result;
        this.uploadPicture.next(uploadPicture);
        checkIfStillLoading(index);
      };
    }
  }

  onUndo(leaguePicture: LeaguePicture): void {
    this.uploadPicture.next(leaguePicture);
  }

  onSave() {
    this.galleryService
      .saveLeaguePictures(this.newLeaguePictures)
      .subscribe(v => console.log(v));
  }

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
