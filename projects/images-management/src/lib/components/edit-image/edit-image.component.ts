import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

// https://github.com/ailon/markerjs2
import * as markerjs2 from 'markerjs2';
import { PhotoService } from '../../services/photoService/photo.service';


@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css'],
})
export class EditImageComponent {
  @ViewChild('myimg') myimg: ElementRef | null = null;

  @Input() imageSourceUrl: Record<string, any> = {};

  markerArea: any;
  base64: string = '';

  constructor(private modalController: ModalController, private photoService: PhotoService) {}

  async ionViewDidEnter() {
    if (this.imageSourceUrl) {
     this.base64 =  await this.photoService.readFile(this.imageSourceUrl)
   }
    if (this.myimg) {
      this.markerArea = new markerjs2.MarkerArea(this.myimg.nativeElement);
      this.markerArea.settings.displayMode = 'popup';
      this.markerArea.renderAtNaturalSize = true;
      this.markerArea.renderImageType = 'image/jpeg';
      this.markerArea.settings.defaultColor = 'yellow';

      this.markerArea.availableMarkerTypes = [
        markerjs2.ArrowMarker,
        markerjs2.FreehandMarker,
        // markerjs2.TextMarker,
        markerjs2.HighlightMarker,
        markerjs2.FrameMarker,
        markerjs2.EllipseFrameMarker,
      ];


      this.markerArea.addRenderEventListener((dataUrl: string) => {
        if (this.myimg) {
          this.myimg.nativeElement.setAttribute('src', dataUrl);

        }
        this.modalController.dismiss({
          filepath: this.imageSourceUrl.filepath,
          base64: dataUrl,
          fileName: this.imageSourceUrl.fileName,
        });
      });

      this.markerArea.addEventListener("beforeclose", (event: any) => {
        this.modalController.dismiss();
      });
      this.markerArea.show();
    }
  }
}
