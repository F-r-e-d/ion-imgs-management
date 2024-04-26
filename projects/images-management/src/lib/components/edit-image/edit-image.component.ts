import {
  Component,
  ElementRef,
  // EventEmitter,
  Input,
  // Output,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

// https://github.com/ailon/markerjs2
import * as markerjs2 from 'markerjs2';
import { PhotoService } from '../../services/photoService/photo.service';
// import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css'],
})
export class EditImageComponent {
  @ViewChild('myimg') myimg: ElementRef | null = null;

  @Input() private imageSourceUrl: Record<string, any> = {};
  @Input() path = 'images-management-library-docs';
  @Input() textMarkers = false;

  // @Output() private imageSourceUrlChange: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  // @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  private markerArea: any;
  protected base64: string = '';

  constructor(
    private modalController: ModalController,
    private photoService: PhotoService
  ) {}

  async ngAfterViewInit() {
    if (this.imageSourceUrl) {
      this.base64 = await this.photoService.readFile(
        this.path,
        this.imageSourceUrl
      );
    }
    if (this.myimg) {
      this.markerArea = new markerjs2.MarkerArea(this.myimg.nativeElement);
      this.markerArea.settings.displayMode = 'popup';
      this.markerArea.renderAtNaturalSize = true;
      this.markerArea.renderImageType = 'image/jpeg';
      this.markerArea.settings.defaultColor = 'yellow';

      if (this.textMarkers) {
        this.markerArea.availableMarkerTypes = [
          markerjs2.ArrowMarker,
          markerjs2.CalloutMarker,
          markerjs2.FreehandMarker,
          markerjs2.TextMarker,
          markerjs2.HighlightMarker,
          markerjs2.FrameMarker,
          markerjs2.EllipseFrameMarker,
        ];
      } else {
        this.markerArea.availableMarkerTypes = [
          markerjs2.ArrowMarker,
          markerjs2.FreehandMarker,
          markerjs2.HighlightMarker,
          markerjs2.FrameMarker,
          markerjs2.EllipseFrameMarker,
        ];
      }

      this.markerArea.addRenderEventListener((dataUrl: string) => {
        if (this.myimg) {
          this.myimg.nativeElement.setAttribute('src', dataUrl);
        }

        // this.imageSourceUrlChange.emit({
        //   filepath: this.imageSourceUrl.filepath,
        //   base64: dataUrl,
        //   fileName: this.imageSourceUrl.fileName,
        // })
        const newFileName =
          new Date().getTime() +
          '.' +
          this.photoService.getFileExtension(this.imageSourceUrl.fileName);

        this.modalController.dismiss({
          filepath: this.imageSourceUrl.filepath.replace(
            this.imageSourceUrl.fileName,
            newFileName
          ),

          base64: dataUrl,
          oldFileName: this.imageSourceUrl.fileName,
          fileName: newFileName,
        });
      });

      this.markerArea.addEventListener('beforeclose', (event: any) => {
        this.modalController.dismiss();
        // this.onClose.emit(true)
      });
      this.markerArea.show();
    }
  }
}
