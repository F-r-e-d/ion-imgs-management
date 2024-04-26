import { Platform } from '@ionic/angular';

import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PhotoService } from '../../services/photoService/photo.service';
import { PhotoInt } from '../../interfaces/PhotoInt';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss'],
})
export class TakePhotoComponent implements OnInit {
  @Input() imagesModel: Array<Record<string, any>> = [];
  // @Output() imagesModelChange: EventEmitter<Array<Record<string, any>>> =
  //   new EventEmitter();
  @Output() onImagesChange: EventEmitter<Array<Record<string, any>>> =
    new EventEmitter();

  @Input() buttonText: string | undefined = undefined;
  @Input() color: string = 'secondary';

  @Input() quality: number | undefined = undefined;
  @Input() width: number | undefined = undefined;
  @Input() height: number | undefined = undefined;
  @Input() allowEditing: boolean | undefined = undefined;
  @Input() path: string = '';
  @Input() public forceOrientation:
  | undefined  | 'portrait' | 'landscape' = undefined;

  @Output() onTakePhoto: EventEmitter<Partial<PhotoInt> | null> =
    new EventEmitter();

  @Output() onError: EventEmitter<string> = new EventEmitter();

  constructor(private photoService: PhotoService, private platform: Platform) {}

  ngOnInit() {
    if (!this.platform.is('hybrid')) {
      setTimeout(() => {
        defineCustomElements(window);
      }, 1000);
    }
  }

  async takePicture(
    path: string = '',
    quality = 100,
    allowEditing = false,
    width = 1500,
    height = 1500
  ): Promise<any> {
    this.onError.emit('');

    if (this.path) {
      path = this.path;
    }

    try {
      const storedPhoto = await this.photoService.takeAndSavePhoto(
        path,
        quality ? quality : this.quality,
        allowEditing ? allowEditing : this.allowEditing,
        width ? width : this.width,
        height ? height : this.height,
        this.forceOrientation
      );

      this.onTakePhoto.emit(storedPhoto);

      if (storedPhoto) {
        const imagesCp = [...this.imagesModel];
        imagesCp.push(storedPhoto);
        // this.imagesModelChange.emit(imagesCp);
        this.onImagesChange.emit(imagesCp);
        return storedPhoto;
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof Error && !error.message?.includes('cancelled')) {
        this.onError.emit(error.message);

      }
    }
  }
}
