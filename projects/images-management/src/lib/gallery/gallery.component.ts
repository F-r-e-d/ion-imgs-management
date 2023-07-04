import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { PhotoService } from '../services/photoService/photo.service';
import { cloneDeep } from 'lodash';
import { PhotoInt } from '../interfaces/PhotoInt';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { EditImageComponent } from '../components/edit-image/edit-image.component';

@Component({
  selector: 'ion-imgs-management',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GalleryComponent {
  @ViewChild('myimg') myimg: Partial<ElementRef> = {};

  @Input() images: Array<any> = [];
  @Input() imagesModel: Array<any> = [];
  @Output() imagesModelChange: EventEmitter<Array<any>> = new EventEmitter<
    Array<any>
  >();

  @Input() title: string = '';
  @Input() compress: boolean = true;

  public sourceDisplayedPhotos: any = [];
  public isLoading = false;
  public update = '';

  constructor(
    private modalController: ModalController,
    private photoService: PhotoService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    setTimeout(() => {

      this.photoService.isLoading.subscribe((value) => {
        this.isLoading = value;
      });
      this.sourceDisplayedPhotos = cloneDeep(this.imagesModel);

    }, 500);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentAlertRemove(source: any) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Attention !',
      message: 'Etes-vous sûr de vouloir supprimer cette photo ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          handler: () => {
            this.removePhoto(source);
          },
        },
      ],
    });

    await alert.present();
  }


  async removePhoto(source: any) {
    let index: number | null = null;
    if (source) {
      index = this.sourceDisplayedPhotos.findIndex(
        (item: PhotoInt) => item.fileName === source.fileName
      );

      this.sourceDisplayedPhotos = this.sourceDisplayedPhotos.filter(
        (item: PhotoInt) => item.fileName !== source.fileName
      );

      try {
        await Filesystem.deleteFile({
          path: `images-management-library-docs/${source.fileName}`,
          directory: Directory.Data,
        });
      } catch (error) {

      }

    }
    this.emitChange();

    return index;
  }

  async takePicture() {
    const storedPhoto = await this.photoService.takeAndSavePhoto();
    if (storedPhoto) {
      this.formatPhoto(storedPhoto);
    }
    this.emitChange();
  }

  async openImageViewer(imageSourceUrl: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: { imageSourceUrl },
    });
    modal.onDidDismiss().then(async (datas) => {
      if (datas?.data?.update !== undefined) {
        this.update = String(Math.random());
      }

    });
    return await modal.present();
  }

  /**
   * It opens a modal that allows the user to edit the image
   * @param imageSourceUrl - The source of the image that is going to be edited.
   * @returns The modal is being returned.
   */
  async openEditImage(imageSourceUrl: any) {
    const modal = await this.modalController.create({
      component: EditImageComponent,
      cssClass: 'edit_image_modal',
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
   * It takes a photo object, and then reads the file from the filesystem, and then adds it to the
   * displayedPhotos array.
   * @param photo - {
   * @param [index=null] - the index of the photo in the array
   */
  formatPhoto(
    photo: Partial<PhotoInt>,
    index: number | null = null
  ) {
    if (index === null) {
      index = this.sourceDisplayedPhotos.length;
    }

    this.sourceDisplayedPhotos.splice(index, 0, {
      filepath: photo?.fileName,
      fileName: photo.fileName,
    });

  }
  emitChange() {
    this.imagesModelChange.emit(this.sourceDisplayedPhotos);
  }

  imagesModelChangeF(event: any) {
    this.imagesModel = event;
    this.sourceDisplayedPhotos = this.imagesModel;
    this.emitChange();
  }

  ionViewDidLeave() {}
}
