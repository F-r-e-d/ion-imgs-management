/* eslint-disable max-len */
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { CropImageComponent } from '../components/crop-image/crop-image.component';
import { EditImageComponent } from '../components/edit-image/edit-image.component';
import { PhotoService } from '../services/photoService/photo.service';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ImageViewerComponent implements OnInit {
  @ViewChild('myimg') myimg: ElementRef | null = null;

  @Input() imageSourceUrl: Record<string, any> = {};

  public update = '';

  public size: number | null = null;

  constructor(private modalController: ModalController, private photoService: PhotoService) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    // const img = await Filesystem.stat({
    //   directory: Directory.Data,
    //     path: `images-management-library-docs/${this.imageSourceUrl.fileName}`,
    // })
    // this.size = (img.size/1000)
  }

  close() {
    this.modalController.dismiss({
      update: this.update ? this.update : undefined
    });
  }

  /**
   * It opens a modal that allows the user to edit the image
   * @param imageSourceUrl - The source of the image that is going to be edited.
   * @returns The modal is being returned.
   */
  async openEditImage(imageSourceUrl: any) {
    const modal = await this.modalController.create({
      component: EditImageComponent,
      cssClass: 'modal-window',
      componentProps: { imageSourceUrl },
    });
    modal.onDidDismiss().then(async (datas) => {
      /* Checking if the data is not undefined. If it is not, it is calling the editPicture function from the
      photoService. */
      if (datas?.data !== undefined) {
        await this.photoService.editPicture(datas.data);

        this.update = String(Math.random());
      }
    });
    return await modal.present();
  }


  /**
   * It opens a modal that contains a component that allows the user to crop an image. When the user is
   * done cropping the image, the modal is dismissed and the cropped image is returned to the calling
   * component
   * @param imageSourceUrl - The image source url to be cropped.
   * @returns The modal is being returned.
   */
  async openCropImage(imageSourceUrl: Record<string, any>) {

    const modal = await this.modalController.create({
      component: CropImageComponent,
      cssClass: 'modal-window',
      componentProps: { imageSourceUrl }
    });
    modal.onDidDismiss().then(async (datas) => {
        if (datas?.data !== undefined) {
        await this.photoService.editPicture(datas.data);
        // this.modalController.dismiss({ filepath: savedPicture.filepath, fileName: savedPicture.fileName });
        this.update = String(Math.random());
      }
    });
    return await modal.present();
  }
}
