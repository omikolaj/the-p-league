import { CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';
import { LeaguePicture } from 'src/app/core/models/league-picture.model';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';
import { LeagueImageUpload } from 'src/app/helpers/Constants/ThePLeagueConstants';

@Component({
	selector: 'app-admin-control',
	templateUrl: './admin-control.component.html',
	styleUrls: ['./admin-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminControlComponent implements OnInit, OnDestroy, AfterViewInit {
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	// #region DragAndDrop Properties
	@ViewChild(CdkDropListGroup, { static: false }) listGroup: CdkDropListGroup<CdkDropList>;
	@ViewChild(CdkDropList, { static: false }) placeholder: CdkDropList;
	public target: CdkDropList;
	public targetIndex: number;
	public source: CdkDropList;
	public sourceIndex: number;
	public dragIndex: number;
	public activeContainer;
	// #endregion

	@Input() galleryImages: LeaguePicture[];
	panelOpenState = false;
	// selectedImagesFormData: FormData = new FormData();
	leaguePicturesMarkedForDeletion: LeaguePicture[] = [];
	subscriptions: Subscription = new Subscription();
	fileReaders: FileReader[] = [];
	isLoading = false;
	subscription: Subscription;

	constructor(private viewportRuler: ViewportRuler, public galleryService: GalleryService, private eventBus: EventBusService) {
		this.target = null;
		this.source = null;
	}

	ngOnInit(): void {
		this.subscription = this.eventBus.on(Events.Loading, (isLoading) => (this.isLoading = isLoading));
	}

	ngAfterViewInit(): void {
		const phElement = this.placeholder.element.nativeElement;

		phElement.style.display = 'none';
		phElement.parentElement.removeChild(phElement);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.fileReaders.forEach((fR) => fR.abort());
	}

	onChangeOrder(): void {
		this.galleryService.updateLeaguePicturesOrder(this.galleryImages);
	}

	onChange(event: MatCheckboxChange, index: number): void {
		const galleryImagesUpdated = [...this.galleryImages];
		const leaguePicture: LeaguePicture = galleryImagesUpdated[index];

		leaguePicture.delete = event.checked;
		if (leaguePicture.delete) {
			this.leaguePicturesMarkedForDeletion.push(leaguePicture);
		} else {
			if (this.leaguePicturesMarkedForDeletion.includes(leaguePicture)) {
				this.leaguePicturesMarkedForDeletion = this.leaguePicturesMarkedForDeletion.filter((lP: LeaguePicture) => {
					return lP.id !== leaguePicture.id;
				});
			}
		}
		this.galleryImages = galleryImagesUpdated;
	}

	onDelete(): void {
		const photosToDelete: LeaguePicture[] = this.galleryImages.filter((lP: LeaguePicture) => lP.delete === true);
		this.galleryService.deleteLeaguePictures(photosToDelete);
	}

	disableDelete(): boolean {
		if (this.galleryImages.length === 0) {
			return true;
		} else {
			return this.leaguePicturesMarkedForDeletion.length === 0;
		}
	}

	onImagesSelected(event) {
		const fileList: FileList = event.target.files;
		if (fileList.length > 0) {
			// this.loading = true;
			this.galleryService.onLoading(true);
		}
		const checkIfStillLoading = (index) => {
			if (index === fileList.length - 1) {
				// this.loading = false;
				this.galleryService.onLoading(false);
			}
		};

		for (let index = 0; index < fileList.length; index++) {
			const uploadPicture: LeaguePicture = {
				preview: {
					file: fileList[index],
					error: false,
					name: fileList[index].name
				},
				big: '../../../../assets/default_gallery.jpg',
				medium: '../../../../assets/default_gallery.jpg',
				small: '../../../../assets/default_gallery.jpg'
			};

			this.galleryService.selectedImagesFormData.append(
				`${LeagueImageUpload.LeagueImages}_${uploadPicture.preview.name}`,
				uploadPicture.preview.file
			);

			this.galleryService.newLeaguePictures.push(uploadPicture);

			const mimeType = uploadPicture.preview.file.type;
			if (mimeType.match(/image\/*/) == null) {
				uploadPicture.preview.error = true;
				uploadPicture.preview.message = 'Only images are supported.';
				uploadPicture.preview.src = '../../../../assets/warning.jpg';
				this.galleryService.uploadPicture.next(uploadPicture);
				checkIfStillLoading(index);
				continue;
			}

			const reader: FileReader = new FileReader();
			this.fileReaders.push(reader);
			reader.readAsDataURL(uploadPicture.preview.file);
			reader.onload = (onLoadEvent: any) => {
				uploadPicture.preview.src = onLoadEvent.target.result;
				this.galleryService.uploadPicture.next(uploadPicture);
				checkIfStillLoading(index);
			};
		}
	}

	onUndo(leaguePicture: LeaguePicture): void {
		this.galleryService.uploadPicture.next(leaguePicture);
	}

	// After executing onSave I have to re-emit all of the uploaded pictures again
	// which are stored in this.newLeaguePictures, to remove them from the preview
	onSave() {
		// this.galleryService.createLeagueImages(this.galleryService.selectedImagesFormData);
		this.galleryService.createLeagueImages();
	}

	// #region Drag and Drop methods
	dragMoved(e: CdkDragMove) {
		const point = this.getPointerPositionOnPage(e.event);

		this.listGroup._items.forEach((dropList) => {
			if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
				this.activeContainer = dropList;
				return;
			}
		});
	}

	dropListDropped() {
		if (!this.target) {
			return;
		}

		const phElement = this.placeholder.element.nativeElement;
		const parent = phElement.parentElement;

		phElement.style.display = 'none';

		parent.removeChild(phElement);
		parent.appendChild(phElement);
		parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

		this.target = null;
		this.source = null;

		if (this.sourceIndex !== this.targetIndex) {
			moveItemInArray(this.galleryImages, this.sourceIndex, this.targetIndex);
			this.onChangeOrder();
		}
	}

	dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
		if (drop === this.placeholder) {
			return true;
		}

		if (drop !== this.activeContainer) {
			return false;
		}

		const phElement = this.placeholder.element.nativeElement;
		const sourceElement = drag.dropContainer.element.nativeElement;
		const dropElement = drop.element.nativeElement;

		const dragIndex = __indexOf(dropElement.parentElement.children, this.source ? phElement : sourceElement);
		const dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

		if (!this.source) {
			this.sourceIndex = dragIndex;
			this.source = drag.dropContainer;

			phElement.style.width = sourceElement.clientWidth + 'px';
			phElement.style.height = sourceElement.clientHeight + 'px';

			sourceElement.parentElement.removeChild(sourceElement);
		}

		this.targetIndex = dropIndex;
		this.target = drop;

		phElement.style.display = '';
		dropElement.parentElement.insertBefore(phElement, dropIndex > dragIndex ? dropElement.nextSibling : dropElement);

		this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
		return false;
	};

	/** Determines the point of the page that was touched by the user. */
	getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
		// `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
		const point = __isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
		const scrollPosition = this.viewportRuler.getViewportScrollPosition();

		return {
			x: point.pageX - scrollPosition.left,
			y: point.pageY - scrollPosition.top
		};
	}
	// #endregion
}

// #region Drag and Drop functions
function __indexOf(collection, node) {
	return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
	return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
	const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
	return y >= top && y <= bottom && x >= left && x <= right;
}

// #endregion Drag and Drop functions
