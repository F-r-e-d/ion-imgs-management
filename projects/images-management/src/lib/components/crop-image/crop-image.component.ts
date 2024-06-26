import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoService } from '../../services/photoService/photo.service';
import { ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CropImageComponent implements OnInit {
  @Input() private imageSourceUrl: Record<string, any> = {};
  @Input() path = 'images-management-library-docs';

  public croppedImage: Record<string, any> = {};
  public base64: string = '';

  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;

  transform: ImageTransform = {
    translateUnit: 'px'
  };

  constructor(
    private modalController: ModalController,
    private photoService: PhotoService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {

    if (this.imageSourceUrl) {
      this.base64 = await this.photoService.readFile(
        this.path,
        this.imageSourceUrl
      );
      // this.imageSourceUrl.base64 = `data:image/jpeg;base64,${this.imageSourceUrl.base64}`;
    }
  }

  rotateRight() {
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  /**
   * The imageCropped function is called when the image is cropped. It takes the cropped image and stores
   * it in the croppedImage variable.
   * @param event - The event object that is passed to the function.
   */
  async imageCropped(event: any) {
    this.croppedImage = event;
  }

  //  blobToBase64(url: string): Promise<any> {
  //   return new Promise(async (resolve, _) => {
  //     // do a request to the blob uri
  //     const response = await fetch(url);

  //     // response has a method called .blob() to get the blob file
  //     const blob = await response.blob();

  //     // instantiate a file reader
  //     const fileReader = new FileReader();

  //     // read the file
  //     fileReader.readAsDataURL(blob);

  //     fileReader.onloadend = function(){
  //       resolve(fileReader.result); // Here is the base64 string
  //     }
  //   });
  // };

  /**
   * It takes the image source url, the cropped image, and the file name and passes it to the modal
   * controller.
   */
  async validCrop() {
    // const file = await this.blobToBase64(this.croppedImage.objectUrl);
    const newFileName =
      new Date().getTime() +
      '.' +
      this.photoService.getFileExtension(this.imageSourceUrl.fileName);
    this.modalController.dismiss({
      filepath: this.imageSourceUrl.filepath.replace(
        this.imageSourceUrl.fileName,
        newFileName
      ),
      base64: this.croppedImage.base64,
      oldFileName: this.imageSourceUrl.fileName,
      fileName: newFileName,
    });
  }

  close() {
    this.modalController.dismiss();
  }
}
