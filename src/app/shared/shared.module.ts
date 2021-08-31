import { AccountingIftaComponent } from './../accounting/accounting-ifta/accounting-ifta.component';
import { NgModule } from '@angular/core';
import { AppUploadExcelComponent } from './app-upload-excel/app-upload-excel.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from 'src/app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { NgxMaskModule } from 'ngx-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LabelModule } from '@progress/kendo-angular-label';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { KendoModule } from 'src/app/modules/kendo.module';
import { CommonModule } from '@angular/common';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AppCustomSearchComponent } from './app-custom-search/app-custom-search.component';
import { AppBankAddComponent } from './app-bank/app-bank-add/app-bank-add.component';
import { AppColorAddComponent } from './app-color/app-color-add/app-color-add.component';
import { AppCompanyFactoringEditComponent } from './app-company-factoring-edit/app-company-factoring-edit.component';
import { AppEmptyComponent } from './app-empty/app-empty.component';
import { AppNoPageFoundComponent } from './app-no-page-found/app-no-page-found.component';
import { AppUploadComponent } from '../core/file-upload/upload/app-upload/app-upload.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { FilesUploadWrapperComponent } from 'src/app/core/file-upload/upload/files-upload-wrapper/files-upload-wrapper.component';
import { RequiredLabelComponent } from 'src/app/core/forms/required-label/required-label.component';
import { AppCompanyOfficeEditComponent } from './app-company-office-edit/app-company-office-edit.component';
import { NoDataComponent } from './no-data/no-data.component';
import { PipesModule } from 'src/app/modules/pipes.module';
import { AppDropdownMenuComponent } from './app-dropdown-menu/app-dropdown-menu.component';
import { TruckassistTableComponent } from './truckassist-table/truckassist-table.component';
import { RouterModule } from '@angular/router';
import { TaStatusSelectComponent } from '../core/ta-status-select/ta-status-select.component';
import { TaStatusSwitchComponent } from './../core/ta-status-switch/ta-status-switch.component';
import { TaSelectComponent } from '../core/ta-select/ta-select.component';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { RepairShopManageComponent } from './app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { AppCardComponent } from './app-card/app-card.component';
import { TaSwitchComponent } from '../core/ta-switch/ta-switch.component';
import { TaTabSwitchComponent } from '../core/ta-tab-switch/ta-tab-switch.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ClipboardModule } from 'ngx-clipboard';
import { TatooltipDirective } from './directives/tatooltip.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { InputFocusDirective } from './directives/input-focus.directive';
import { InputRestrictionDirective } from './directives/restriction.directive';
import { TruckassistDropdownComponent } from './truckassist-dropdown/truckassist-dropdown.component';
import { SidebarChatComponent } from './sidebar-chat/sidebar-chat.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TaNoteComponent } from './ta-note/ta-note.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { EditImageComponent } from './edit-image/edit-image.component';
import { CroppieModule } from 'angular-croppie-module';
import { AwesomeTooltipComponent } from './directives/awesome-tooltip/awesome-tooltip.component';
import { AwesomeTooltipDirective } from './directives/awesome-tooltip/awesome-tooltip.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { ToolsMenuComponent } from './tools-menu/tools-menu.component';
import { ExportAsModule } from 'ngx-export-as';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TruckassistHistoryDataComponent } from './truckassist-history-data/truckassist-history-data.component';
import { UnitSwitchComponent } from './unit-switch/unit-switch.component';
import { LoadRoutesComponent } from './load-routes/load-routes.component';
import { ProgressExpirationComponent } from './progress-expiration/progress-expiration.component';
import { TruckassistCheckboxComponent } from './truckassist-checkbox/truckassist-checkbox.component';
import { AppCommentsComponent } from './app-comments/app-comments.component';
import { TruckassistButtongroupComponent } from './truckassist-buttongroup/truckassist-buttongroup.component';
import { ExportExcelComponent } from './truckassist-table/export-excel/export-excel.component';
import { DateFormatterPipe } from './date-formatter/date-formater.pipe';
import { AppUploadNewComponent } from './app-upload-new/app-upload-new.component';
import { ShortenTextPipe } from './shorten-text/shorten-text.pipe';
import { LabelButtonComponent } from './label-button/label-button.component';
import { CopiedComponent } from './copied/copied.component';
import { SanitizeHtmlPipe } from './sanitize-html/sanitize-html.pipe';
import { FilterPipe } from './filter/filter.pipe';
import { DocumentComponent } from '../shared/document/document.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { EditProfileImageComponent } from './edit-profile-image/edit-profile-image.component';
import { UploadLogoComponent } from './upload-logo/upload-logo.component';
import { ResizableModule } from '../resizable/resizable.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ValueByFieldPipe } from './truckassist-table/pipes/value-by-filed.pipe';
import { AvatarByFieldPipe } from './truckassist-table/pipes/avatar-by-field.pipe';
import { TooltipBgPipe } from './truckassist-table/pipes/tooltip-bg.pipe';
import { PreloadsComponent } from './preloads/preloads.component';
import { TruckassistReveiwComponent } from './truckassist-reveiw/truckassist-reveiw.component';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { DeleteDropdownDialogComponent } from './delete-dropdown-dialog/delete-dropdown-dialog.component';
import { VirtualScrollerDefaultOptions, VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { LogoChangeComponent } from './logo-change/logo-change.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { TruckassistDateFilterComponent } from './truckassist-date-filter/truckassist-date-filter.component';
import { ModalCloseComponent } from './modal-close/modal-close.component';
import { NFormatterPipe } from './truckassist-table/pipes/n-formatter.pipe';
import { SelectionColorDirective } from './directives/selection-color.directive';
import { AttachmentsComponent } from '../core/file-upload/upload/attachments/attachments.component';
import { LabelFilterPipe } from './truckassist-table/pipes/label-filter.pipe';
import { DopplerLegendComponent } from './doppler-legend/doppler-legend.component';
import { TruckassistRadioButtonComponent } from './truckassist-radio-button/truckassist-radio-button.component';
import { MapControlComponent } from './map-control/map-control.component';
import { SvgMorphComponent } from './svg-morph/svg-morph.component';
import { CardPreviewComponent } from './../core/file-upload/card-preview/card-preview.component';
import { CustomWysiwygEditorComponent } from './custom-wysiwyg-editor/custom-wysiwyg-editor.component';
import { SanitizeUrlPipe } from './sanitize-url/sanitize-url.pipe';
import { TaCardComponent } from './ta-card/ta-card.component';
import { CustomTabComponent } from './custom-tab/custom-tab.component';
import { LoadStatusFilterComponent } from './load-status-filter/load-status-filter.component';
import { TaNoteContainerComponent } from './ta-note/ta-note-container/ta-note-container.component';
import { BackBtnComponent } from './back-btn/back-btn.component';
import { TruckassistActionStackComponent } from './truckassist-action-stack/truckassist-action-stack.component';
import { TableViewSwitcherComponent } from './table-view-switcher/table-view-switcher.component';
import { TruckassistCardComponent } from './truckassist-card/truckassist-card.component';
import { TimezoneLegendComponent } from './timezone-legend/timezone-legend.component';
import { TrafficLegendComponent } from './traffic-legend/traffic-legend.component';
import { GpsLegendComponent } from './gps-legend/gps-legend.component';
import { GpsStatisticComponent } from './gps-statistic/gps-statistic.component';
import { LoadCommentsComponent } from './load-comments/load-comments.component';
import { GpsStatisticStopsComponent } from './gps-statistic-stops/gps-statistic-stops.component';
import { CustomTabSelectComponent } from './custom-tab-select/custom-tab-select.component';
import { SortPopupComponent } from './sort-popup/sort-popup.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { RepairPmSwitcherComponent } from './repair-pm-switcher/repair-pm-switcher.component';
import { ShopListsComponent } from '../repairs/shop-map/shop-lists/shop-lists.component';
import { ShopMapComponent } from '../repairs/shop-map/shop-map.component';
import { PmAddOrFilterComponent } from './pm-add-or-filter/pm-add-or-filter.component';
import { CustomRangeDatepickerComponent } from './custom-range-datepicker/custom-range-datepicker.component';
import { ViolationTooltipComponent } from './violation-tooltip/violation-tooltip.component';
import { HeaderActivityComponent } from './header-activity/header-activity.component';
import { ViolationGroupFilterComponent } from './violation-group-filter/violation-group-filter.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViolationSummaryFilterGroupComponent } from './violation-summary-filter-group/violation-summary-filter-group.component';
import { ViolationMapComponent } from '../safety/safety-violation/violation-map/violation-map.component';
import { ViolationMapListComponent } from '../safety/safety-violation/violation-map/violation-map-list/violation-map-list.component';
import { CellTemplatesComponent } from './truckassist-table/cell-templates/cell-templates.component';
import { CtrlTemplateDirective } from './truckassist-table/directives/ctrl-template.directive';
import { ViolationSummaryComponent } from '../safety/safety-violation/violation-summary/violation-summary.component';
import { ModalSaveComponent } from './modal-save/modal-save.component';
import { TaTitleCaseDirective } from './directives/taTitleCase.directive';
import { IsStringPipe } from './truckassist-table/pipes/is-string.pipe';
import { AccidentMapComponent } from '../safety/safety-accident/accident-map/accident-map.component';
import { AccidentMapListComponent } from '../safety/safety-accident/accident-map/accident-map-list/accident-map-list.component';
import { CompanyInsurancePolicyEditComponent } from './company-insurance-policy-edit/company-insurance-policy-edit.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { NoEmptyStatusComponent } from './no-empty-status/no-empty-status.component';
import { CustomDatetimePickersComponent } from './custom-datetime-pickers/custom-datetime-pickers.component';
import { InsuranceTypeEditComponent } from './company-insurance-policy-edit/insurance-type-edit/insurance-type-edit.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '$',
  suffix: '',
  thousands: ',',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL,
};

@NgModule({
  declarations: [
    AppUploadExcelComponent,
    AppCustomSearchComponent,
    AppBankAddComponent,
    AppColorAddComponent,
    AppCompanyFactoringEditComponent,
    AppEmptyComponent,
    AppNoPageFoundComponent,
    AppUploadComponent,
    CompanyInfoComponent,
    AppCompanyOfficeEditComponent,
    NoDataComponent,
    FilesUploadWrapperComponent,
    RequiredLabelComponent,
    LoadingModalComponent,
    RepairShopManageComponent,
    AppCardComponent,
    AppDropdownMenuComponent,
    TaSelectComponent,
    TaSwitchComponent,
    TaTabSwitchComponent,
    TruckassistTableComponent,
    TaStatusSelectComponent,
    TaStatusSwitchComponent,
    TatooltipDirective,
    TaTitleCaseDirective,
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    TruckassistDropdownComponent,
    SidebarChatComponent,
    TaNoteComponent,
    EditImageComponent,
    AwesomeTooltipDirective,
    AwesomeTooltipComponent,
    ToolsMenuComponent,
    TruckassistHistoryDataComponent,
    UnitSwitchComponent,
    LoadRoutesComponent,
    ProgressExpirationComponent,
    TruckassistCheckboxComponent,
    AppCommentsComponent,
    TruckassistButtongroupComponent,
    ExportExcelComponent,
    DateFormatterPipe,
    AppUploadNewComponent,
    ShortenTextPipe,
    LabelButtonComponent,
    CopiedComponent,
    SanitizeHtmlPipe,
    SanitizeUrlPipe,
    FilterPipe,
    DocumentComponent,
    DeleteDialogComponent,
    EditProfileImageComponent,
    UploadLogoComponent,
    ValueByFieldPipe,
    AvatarByFieldPipe,
    TooltipBgPipe,
    PreloadsComponent,
    TruckassistReveiwComponent,
    ResizeObserverDirective,
    DeleteDropdownDialogComponent,
    LogoChangeComponent,
    TruckassistDateFilterComponent,
    SvgMorphComponent,
    ModalCloseComponent,
    NFormatterPipe,
    SelectionColorDirective,
    AttachmentsComponent,
    LabelFilterPipe,
    DopplerLegendComponent,
    TruckassistRadioButtonComponent,
    MapControlComponent,
    SvgMorphComponent,
    CardPreviewComponent,
    CustomWysiwygEditorComponent,
    TaCardComponent,
    CustomTabComponent,
    LoadStatusFilterComponent,
    TaNoteContainerComponent,
    BackBtnComponent,
    TruckassistActionStackComponent,
    TableViewSwitcherComponent,
    TruckassistCardComponent,
    TimezoneLegendComponent,
    TrafficLegendComponent,
    GpsLegendComponent,
    GpsStatisticComponent,
    LoadCommentsComponent,
    GpsStatisticStopsComponent,
    CustomTabSelectComponent,
    SortPopupComponent,
    ShopMapComponent,
    ShopListsComponent,
    RepairPmSwitcherComponent,
    PmAddOrFilterComponent,
    CustomRangeDatepickerComponent,
    ViolationTooltipComponent,
    HeaderActivityComponent,
    ViolationGroupFilterComponent,
    ViolationSummaryFilterGroupComponent,
    ViolationMapComponent,
    ViolationMapListComponent,
    CellTemplatesComponent,
    CtrlTemplateDirective,
    ViolationSummaryComponent,
    ModalSaveComponent,
    IsStringPipe,
    AccidentMapComponent,
    AccidentMapListComponent,
    CompanyInsurancePolicyEditComponent,
    AccountingIftaComponent,
    NoResultsComponent,
    NoEmptyStatusComponent,
    InsuranceTypeEditComponent,
    UnderConstructionComponent,
    CustomDatetimePickersComponent,
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    KendoModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    EditorModule,
    NgxMaskModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: true,
      customClass: 'modal-content',
      title: 'Confirm the deletion',
      reverseButtons: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      showCloseButton: true,
      type: 'warning',
      focusConfirm: false,
      focusCancel: false,
    }),
    NgbModule,
    CarouselModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      enableHtml: true,
      timeOut: 5000,
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
      libraries: ['geometry', 'places'],
    }),
    AgmDirectionModule,
    AgmSnazzyInfoWindowModule,
    ImageCropperModule,
    LabelModule,
    AngularSvgIconModule.forRoot(),
    AngularSvgIconPreloaderModule.forRoot({
      configUrl: '../../assets/imgPreloadJson/svgImages.json',
    }),
    GooglePlaceModule,
    PipesModule,
    Ng5SliderModule,
    PickerModule,
    ClipboardModule,
    ClickOutsideModule,
    CroppieModule,
    OverlayModule,
    AutocompleteLibModule,
    ExportAsModule,
    ResizableModule,
    NgxSliderModule,
    VirtualScrollerModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    AgmJsMarkerClustererModule,
    PdfViewerModule,
  ],
  exports: [
    AppUploadExcelComponent,
    AppCustomSearchComponent,
    AppColorAddComponent,
    AppCompanyFactoringEditComponent,
    AppEmptyComponent,
    AppNoPageFoundComponent,
    AppUploadComponent,
    CompanyInfoComponent,
    AppCompanyOfficeEditComponent,
    NoDataComponent,
    FilesUploadWrapperComponent,
    RequiredLabelComponent,
    LoadingModalComponent,
    NgxDropzoneModule,
    KendoModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    RouterModule,
    NgxMaskModule,
    SweetAlert2Module,
    NgbModule,
    CarouselModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ToastrModule,
    AgmCoreModule,
    AgmDirectionModule,
    ImageCropperModule,
    LabelModule,
    ClickOutsideModule,
    AngularSvgIconModule,
    GooglePlaceModule,
    PipesModule,
    AutocompleteLibModule,
    PipesModule,
    ExportAsModule,
    AppCardComponent,
    AppDropdownMenuComponent,
    TaSelectComponent,
    TaSwitchComponent,
    TaTabSwitchComponent,
    TruckassistTableComponent,
    TruckassistDropdownComponent,
    TruckassistCheckboxComponent,
    TruckassistRadioButtonComponent,
    TaStatusSelectComponent,
    TaStatusSwitchComponent,
    Ng5SliderModule,
    TatooltipDirective,
    TaTitleCaseDirective,
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    SidebarChatComponent,
    ClipboardModule,
    TaNoteComponent,
    EditImageComponent,
    CroppieModule,
    AwesomeTooltipDirective,
    AwesomeTooltipComponent,
    OverlayModule,
    ToolsMenuComponent,
    TruckassistHistoryDataComponent,
    UnitSwitchComponent,
    LoadRoutesComponent,
    ProgressExpirationComponent,
    AppCommentsComponent,
    DateFormatterPipe,
    ShortenTextPipe,
    CopiedComponent,
    SanitizeHtmlPipe,
    SanitizeUrlPipe,
    TruckassistButtongroupComponent,
    FilterPipe,
    DocumentComponent,
    EditProfileImageComponent,
    ResizableModule,
    NgxSliderModule,
    ValueByFieldPipe,
    AvatarByFieldPipe,
    TooltipBgPipe,
    PreloadsComponent,
    TruckassistReveiwComponent,
    ResizeObserverDirective,
    VirtualScrollerModule,
    NgxCurrencyModule,
    TruckassistDateFilterComponent,
    ModalCloseComponent,
    SvgMorphComponent,
    NFormatterPipe,
    SelectionColorDirective,
    AttachmentsComponent,
    LabelFilterPipe,
    DopplerLegendComponent,
    MapControlComponent,
    CardPreviewComponent,
    CustomWysiwygEditorComponent,
    TaCardComponent,
    CustomTabComponent,
    BackBtnComponent,
    LoadStatusFilterComponent,
    TimezoneLegendComponent,
    TrafficLegendComponent,
    GpsLegendComponent,
    TaNoteContainerComponent,
    GpsStatisticComponent,
    GpsStatisticStopsComponent,
    CustomTabSelectComponent,
    SortPopupComponent,
    PmAddOrFilterComponent,
    CustomRangeDatepickerComponent,
    HeaderActivityComponent,
    ViolationGroupFilterComponent,
    PdfViewerModule,
    ModalSaveComponent,
    IsStringPipe,
    AccountingIftaComponent,
    NoResultsComponent,
    NoEmptyStatusComponent,
    CustomDatetimePickersComponent
  ],
  entryComponents: [
    TruckassistTableComponent,
    AwesomeTooltipComponent,
    TruckassistReveiwComponent,
    DopplerLegendComponent,
    TimezoneLegendComponent,
    TrafficLegendComponent,
    MapControlComponent,
    BackBtnComponent,
    GpsLegendComponent,
    GpsStatisticComponent,
    GpsStatisticStopsComponent,
    SortPopupComponent,
    PmAddOrFilterComponent,
    NoResultsComponent,
    NoEmptyStatusComponent
  ],
})
export class SharedModule {}
