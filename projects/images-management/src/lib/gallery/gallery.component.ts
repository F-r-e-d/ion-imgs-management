import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  // SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  AlertController,
  AnimationController,
  IonCard,
  ModalController,
} from '@ionic/angular';

import { PhotoService } from '../services/photoService/photo.service';
import { cloneDeep } from 'lodash';
import { PhotoInt } from '../interfaces/PhotoInt';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TakePhotoComponent } from './../components/take-photo/take-photo.component';

@Component({
  selector: 'ion-imgs-management',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent implements OnInit, AfterViewInit {
  @ViewChild(IonCard, { read: ElementRef })
  card!: ElementRef<HTMLIonCardElement>;
  // @ViewChild(IonImg, { read: ElementRef })
  // img!: ElementRef<HTMLIonImgElement>;

  @ViewChildren('imgsView') private imgsView!: QueryList<ElementRef>;

  @Input() images: Array<any> = [];
  @Input() takePhotoOnOpen = false;
  @Input() filePicker = true;
  @Input() takePhoto = true;
  @Input() displayLabel = true;
  @Input() path = 'images-management-library-docs';
  @Input() textMarkers = false;

  // @Input() imagesModel: Array<any> | undefined = undefined;
  @Input()
  set imagesModel(value: Array<any>) {
    this.watcher.next(value);
  }

  get imagesModel(): any {
    return this.watcher.value;
  }
  @Output() imagesModelChange: EventEmitter<Array<any>> = new EventEmitter<
    Array<any>
  >();

  @Input() title: string = '';
  @Input() compress: boolean = false;

  public sourceDisplayedPhotos: any = [];
  public isLoading = false;
  public update = '';

  public imageModifiedIndex: number | null = null;

  public watcher: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private initialized = false;

  public editUrl: Record<string, any> | null = null;

  public index: number | null = null;

  constructor(
    private modalController: ModalController,
    private photoService: PhotoService,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
    private photoComponent: TakePhotoComponent
  ) {}

  ngOnInit() {
    this.photoService.isLoading.subscribe((value) => {
      this.isLoading = value;
    });
    this.watcher.subscribe((item: any) => {
      if (item.length && this.initialized === false) {
        this.sourceDisplayedPhotos = cloneDeep(item);
        this.initialized = true;
        this.loadImages();
      }
    });
  }

  async ngAfterViewInit() {
    this.enterAnimation();

    if (this.takePhotoOnOpen) {
      // this.takePicture();
      const ev = await this.photoComponent.takePicture(this.path);
      // console.log(ev);
      const image = await this.photoService.readFile(this.path, ev)
      this.sourceDisplayedPhotos.push({...ev, image});
      this.emitChange()
    }
  }

  async enterAnimation() {
    await this.animationCtrl
      .create()
      .addElement(this.card.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .play();
  }

  public async loadImages() {
    for (const source of this.sourceDisplayedPhotos) {
      const image = await this.photoService.readFile(this.path, source);
      source.image = image;
    }
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
            this.removePhoto(this.path, source);
          },
        },
      ],
    });

    await alert.present();
  }

  public async updateModifiedImage(index: number) {
    if (index !== null) {
      const source = this.sourceDisplayedPhotos[index];
      source.image = await this.photoService.readFile(this.path, source);
    }
  }

  async removePhoto(path: string, source: any) {
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
          path: `${path}/${source.fileName}`,
          directory: Directory.Data,
        });
      } catch (error) {}
    }
    this.imagesModel = this.imagesModel.filter(
      (item: PhotoInt) => item.fileName !== source.fileName
    );
    this.emitChange();

    return index;
  }

  async openImageViewer(imageSourceUrl: Record<string, any>, index: number) {
    this.index = index;

    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: { imageSourceUrl, path: this.path, textMarkers: this.textMarkers },
      cssClass: 'image_viewer_modal',
    });
    modal.onDidDismiss().then(async (datas) => {
      // if (datas?.data?.edit) {
        this.editUrl = imageSourceUrl;
      // }
      // if (datas?.data?.update) {
        this.updateModifiedImage(index);
      // }
    });
    return await modal.present();
  }


  /**
   * It takes a photo object, and then reads the file from the filesystem, and then adds it to the
   * displayedPhotos array.
   * @param photo - {
   * @param [index=null] - the index of the photo in the array
   */
  formatPhoto(photo: Partial<PhotoInt>, index: number | null = null) {
    if (index === null) {
      index = this.sourceDisplayedPhotos.length;
    }

    this.sourceDisplayedPhotos.splice(index, 0, {
      filepath: photo?.fileName,
      fileName: photo.fileName,
    });
    // this.updateModifiedImage(index);
  }
  emitChange() {
    const imgs = cloneDeep(this.sourceDisplayedPhotos).map(
      (item: Record<string, any>) => {
        const obj = { ...item };
        delete obj.image;
        return obj;
      }
    );

    this.imagesModelChange.emit(imgs);
  }

  imagesModelChangeF(event: any) {
    // this.imagesModel = event;
    this.sourceDisplayedPhotos.push(event[event.length - 1]);
    this.loadImages();
    this.emitChange();
  }

  ionViewDidLeave() {}
}
