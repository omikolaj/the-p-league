import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatBadgeModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
	MAT_RIPPLE_GLOBAL_OPTIONS,
	RippleGlobalOptions
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faInstagram, faMediumM, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBasketballBall, faPlayCircle, faRocket, faUndo } from '@fortawesome/free-solid-svg-icons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxGalleryModule } from 'ngx-gallery';
import { CarouselComponent } from './components/carousel/carousel.component';
import { GalleryViewerComponent } from './components/gallery-viewer/gallery-viewer.component';
import { GenericListItemComponent } from './components/generic-list/generic-list-item/generic-list-item.component';
import { GenericListComponent } from './components/generic-list/generic-list.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { ListItemComponentDirective } from './directives/list-item-component.directive';

library.add(faGithub, faMediumM, faTwitter, faInstagram, faYoutube, faPlayCircle, faRocket, faBasketballBall, faUndo);

// This is used for controling the Angular ripples effect globally
// https://material.angular.io/components/ripple/api
const globalRippleConfig: RippleGlobalOptions = {
	terminateOnPointerUp: false
};

@NgModule({
	providers: [{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }],
	declarations: [
		GalleryViewerComponent,
		SnackBarComponent,
		CarouselComponent,
		GenericListComponent,
		ListItemComponentDirective,
		GenericListItemComponent
	],
	imports: [
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatMomentDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule,

		FontAwesomeModule,

		FlexLayoutModule,

		NgxGalleryModule,
		ReactiveFormsModule,
		CommonModule,
		CarouselModule,
		PortalModule
	],
	exports: [
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule,
		MatMomentDateModule,

		FontAwesomeModule,

		FlexLayoutModule,
		GalleryViewerComponent,
		ReactiveFormsModule,
		CommonModule,
		CarouselModule,
		CarouselComponent,
		GenericListComponent,
		ListItemComponentDirective,
		PortalModule
	],
	entryComponents: [SnackBarComponent]
})
export class SharedModule {}
