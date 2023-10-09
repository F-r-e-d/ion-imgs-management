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
  @Input() compress: boolean = false;

  @Input() path: string = '';

  @Output() onTakePhoto: EventEmitter<Partial<PhotoInt> | null> =
    new EventEmitter();

  constructor(private photoService: PhotoService, private platform: Platform) {}

  ngOnInit() {
    if (!this.platform.is('hybrid')) {
      setTimeout(() => {
        defineCustomElements(window);
      }, 1000);
    }
  }

  async takePicture(path: string = ''): Promise<any> {
    if (this.path) {
      path = this.path;
    }
    const storedPhoto = await this.photoService.takeAndSavePhoto(
      path,
      this.compress
    );

    this.onTakePhoto.emit(storedPhoto);

    if (storedPhoto) {
      const imagesCp = [...this.imagesModel];
      imagesCp.push(storedPhoto);
      // this.imagesModelChange.emit(imagesCp);
      this.onImagesChange.emit(imagesCp);
      return storedPhoto;
    }
  }
}
