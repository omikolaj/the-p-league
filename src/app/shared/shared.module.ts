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
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faGithub, faInstagram, faMediumM, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
// import { faBasketballBall, faPlayCircle, faRocket, faUndo } from '@fortawesome/free-solid-svg-icons';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ActingSpinnerComponent } from './components/acting-spinner/acting-spinner/acting-spinner.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { GalleryViewerComponent } from './components/gallery-viewer/gallery-viewer.component';
import { SessionSchedulesComponent } from './components/session-schedules/session-schedules.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { AllowSpacesDirective } from './directives/allow-space/allow-spaces.directive';
import { CdkDetailRowDirective } from './directives/cdk-detail-row/cdk-detail-row.directive';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';
import { HasRoleDirective } from './directives/has-role/has-role.directive';
import { IosVHDirective } from './directives/iosVH/ios-vh.directive';
import { ListItemComponentDirective } from './directives/list-item-component/list-item-component.directive';
import { TeamSwapDirective } from './directives/team-swap/team-swap.directive';
import { EnumToArrayPipe } from './pipes/enumToArray/enum-to-array.pipe';
import { FilteredGearSizesPipe } from './pipes/filteredGearSizes/filtered-gear-sizes.pipe';
import { GearImageViewPipe } from './pipes/gear-image-view/gear-image-view.pipe';
import { LogPipe } from './pipes/log/log.pipe';
import { FromUnixPipe } from './pipes/momentjs/from-unix.pipe';
import { OrderEnumPipe } from './pipes/order-enum.pipe';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner/loading-spinner.component';

//library.add(faGithub, faMediumM, faTwitter, faInstagram, faYoutube, faPlayCircle, faRocket, faBasketballBall, faUndo);

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
		SessionSchedulesComponent,

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
		EnumToArrayPipe,
		TeamSwapDirective,
		FromUnixPipe,
		CdkDetailRowDirective,
		SizeEnumToSizePipe,
		ActingSpinnerComponent,
		LoadingSpinnerComponent
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
		MatStepperModule,
		MatTableModule,
		MatSortModule,
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
		LoadingSpinnerComponent,

		FontAwesomeModule,

		FlexLayoutModule,
		GalleryViewerComponent,
		ReactiveFormsModule,
		CommonModule,
		CarouselModule,
		CarouselComponent,
		SessionSchedulesComponent,
		PortalModule,
		ActingSpinnerComponent,

		// Directives
		AllowSpacesDirective,
		ClearElementValueDirective,
		HasRoleDirective,
		IosVHDirective,
		ListItemComponentDirective,
		TeamSwapDirective,
		CdkDetailRowDirective,

		// Pipes
		OrderEnumPipe,
		LogPipe,
		GearImageViewPipe,
		FilteredGearSizesPipe,
		EnumToArrayPipe,
		FromUnixPipe
	],
	entryComponents: [SnackBarComponent]
})
export class SharedModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faGithub, faInstagram, faTwitter, faPlayCircle);
	}
}
