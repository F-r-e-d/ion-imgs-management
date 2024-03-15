/* eslint-disable max-len */
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  // Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { ModalController } from '@ionic/angular';

import { CropImageComponent } from '../components/crop-image/crop-image.component';
import { PhotoService } from '../services/photoService/photo.service';
import { EditImageComponent } from '../components/edit-image/edit-image.component';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageViewerComponent implements OnInit {
  // @ViewChild('myimg') myimg: ElementRef | null = null;
  @ViewChild('element') element: ElementRef | null = null;

  @Input() imageSourceUrl: Record<string, any> = {};
  @Input() path = 'images-management-library-docs';
  @Input() textMarkers = false;

  public image: string | null = null;
  public update = false;

  public size: number | null = null;
  public editUrl: Record<string, any> | null = null;
  public newImageDatas: Record<string, any> | null = null;

  constructor(
    private modalController: ModalController,
    private photoService: PhotoService
  ) // private elementRef: ElementRef,
  // private renderer: Renderer2
  {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.image = await this.photoService.readFile(
      this.path,
      this.imageSourceUrl
    );
  }

  close() {
    this.modalController.dismiss({
      update: this.update,
      newImageDatas: this.newImageDatas,
    });
  }

  /**
   * It opens a modal that allows the user to edit the image
   * @param imageSourceUrl - The source of the image that is going to be edited.
   * @returns The modal is being returned.
   */
  async openEditImage(imageSourceUrl: Record<string, any>) {
    // this.editUrl = imageSourceUrl;
    // setTimeout(() => {
    //   const el = this.element?.nativeElement.closest('ion-modal');
    //   this.renderer.setStyle(el, 'display', 'none');
    // }, 500);

    const modal = await this.modalController.create({
      component: EditImageComponent,
      cssClass: '',
      componentProps: {
        imageSourceUrl,
        path: this.path,
        textMarkers: this.textMarkers,
      },
    });
    modal.onDidDismiss().then(async (datas) => {
      /* Checking if the data is not undefined. If it is not, it is calling the editPicture function from the
      photoService. */


      if (datas?.data !== undefined) {
        await this.photoService.editPicture(this.path, datas.data);
        // this.image = await this.photoService.readFile(this.path, this.imageSourceUrl);
        this.image = await this.photoService.readFile(this.path, datas.data);
        this.update = true;
        delete datas.data.base64
        delete datas.data.image
        this.newImageDatas = datas.data;
        this.newImageDatas = datas.data;
        this.imageSourceUrl = datas.data
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
      componentProps: { imageSourceUrl, path: this.path },
    });
    modal.onDidDismiss().then(async (datas) => {
      if (datas?.data !== undefined) {
        await this.photoService.editPicture(this.path, datas.data);
        // this.modalController.dismiss({ filepath: savedPicture.filepath, fileName: savedPicture.fileName });
        // this.image = await this.photoService.readFile(this.path, this.imageSourceUrl);
        this.image = await this.photoService.readFile(this.path, datas.data);

        this.update = true;
        delete datas.data.base64
        delete datas.data.image
        this.newImageDatas = datas.data;
        this.imageSourceUrl = datas.data
      }
    });
    return await modal.present();
  }
}
