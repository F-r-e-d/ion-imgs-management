import { NgModule } from '@angular/core';
import { ImagesManagementComponent } from './images-management.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { CropImageComponent } from './components/crop-image/crop-image.component';
// import { EditImageComponent } from './components/edit-image/edit-image.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FilePickerComponent } from './components/file-picker/file-picker.component';

import 'hammerjs/hammer';
import { TakePhotoComponent } from './components/take-photo/take-photo.component';
import { ImagesManagementService } from './images-management.service';
import { NgxImageCaptureModule } from 'custom-ngx-image-compress';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { DragulaModule } from 'ng2-dragula';
// import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  providers: [ImagesManagementService],
  declarations: [
    ImagesManagementComponent,
    GalleryComponent,
    ImageViewerComponent,
    CropImageComponent,
    EditImageComponent,
    FilePickerComponent,
    TakePhotoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PinchZoomModule,
    ImageCropperModule,
    NgxImageCaptureModule,
    DragulaModule.forRoot(),
    // DragDropModule
  ],
  exports: [
    GalleryComponent,
    ImageViewerComponent,
    CropImageComponent,
    EditImageComponent,
    FilePickerComponent,
    TakePhotoComponent
  ]
})
export class ImagesManagementModule {}
