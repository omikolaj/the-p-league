import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule, MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material';
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
import { AllowSpacesDirective } from './directives/allow-space/allow-spaces.directive';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';
import { HasRoleDirective } from './directives/has-role/has-role.directive';
import { IosVHDirective } from './directives/iosVH/ios-vh.directive';
import { ListItemComponentDirective } from './directives/list-item-component.directive';
import { EnumToArrayPipe } from './pipes/enumToArray/enum-to-array.pipe';
import { FilteredGearSizesPipe } from './pipes/filteredGearSizes/filtered-gear-sizes.pipe';
import { GearImageViewPipe } from './pipes/gear-image-view/gear-image-view.pipe';
import { LogPipe } from './pipes/log/log.pipe';
import { OrderEnumPipe } from './pipes/order-enum.pipe';

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
		GenericListItemComponent,

		// Directives
		AllowSpacesDirective,
		ClearElementValueDirective,
		HasRoleDirective,
		IosVHDirective,
		ListItemComponentDirective,

		// Pipes
		OrderEnumPipe,
		LogPipe,
		GearImageViewPipe,
		FilteredGearSizesPipe,
		EnumToArrayPipe
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
		PortalModule,

		// Directives
		AllowSpacesDirective,
		ClearElementValueDirective,
		HasRoleDirective,
		IosVHDirective,
		ListItemComponentDirective,

		// Pipes
		OrderEnumPipe,
		LogPipe,
		GearImageViewPipe,
		FilteredGearSizesPipe,
		EnumToArrayPipe
	],
	entryComponents: [SnackBarComponent]
})
export class SharedModule {}
