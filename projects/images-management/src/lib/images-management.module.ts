import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { ImagesManagementComponent } from './images-management.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { CropImageComponent } from './components/crop-image/crop-image.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { ReadFilePipe } from './pipes/readFile/read-file.pipe';

import 'hammerjs/hammer';
import { TakePhotoComponent } from './components/take-photo/take-photo.component';
import { ImagesManagementService } from './images-management.service';
import { NgxImageCaptureModule } from 'ngx-image-compress';

@NgModule({
  providers: [ImagesManagementService],
  declarations: [
    ImagesManagementComponent,
    GalleryComponent,
    ImageViewerComponent,
    CropImageComponent,
    EditImageComponent,
    FilePickerComponent,
    ReadFilePipe,
    TakePhotoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PinchZoomModule,
    ImageCropperModule,
    NgxImageCaptureModule
  ],
  exports: [
    GalleryComponent,
    ImageViewerComponent,
    CropImageComponent,
    EditImageComponent,
    FilePickerComponent,
    ReadFilePipe,
    TakePhotoComponent
  ]
})
export class ImagesManagementModule {}
