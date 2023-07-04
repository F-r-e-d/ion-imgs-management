import { Platform } from '@ionic/angular';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoService } from '../../services/photoService/photo.service';
import { PhotoInt } from '../../interfaces/PhotoInt';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss'],
})
export class TakePhotoComponent implements OnInit {
  @Input() imagesModel: Array<Record<string, any>> = [];
  @Output() imagesModelChange: EventEmitter<Array<Record<string, any>>> =
    new EventEmitter();

  @Input() buttonText: string | undefined = undefined;
  @Input() color: string = 'secondary';
  @Input() compress: boolean = false;

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

  async takePicture() {
    const storedPhoto = await this.photoService.takeAndSavePhoto(this.compress);

    this.onTakePhoto.emit(storedPhoto);

    if (storedPhoto) {
      const imagesCp = [...this.imagesModel];
      imagesCp.push(storedPhoto);
      this.imagesModelChange.emit(imagesCp);

    }
  }
}
