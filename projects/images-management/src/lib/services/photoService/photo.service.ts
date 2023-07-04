import { Injectable } from '@angular/core';
import {
  Camera,
  Photo,
  CameraResultType,
  CameraSource,
  CameraDirection,
} from '@capacitor/camera';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

import imageCompression from 'browser-image-compression';
import { BehaviorSubject } from 'rxjs';
import { PhotoInt } from '../../interfaces/PhotoInt';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photo: PhotoInt | null = null;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private platform: Platform) {}

  /**
   * It takes a photo, saves it to the device, and returns the saved image file.
   * @returns The savedImageFile is being returned.
   */
  public async takeAndSavePhoto(compress: boolean = false) {
    this.isLoading.next(true);

    let quality = 100;
    if (compress) {
      quality = 60;
    }

    // Take a photo

    /* Taking a photo and returning the photo as a base64 string. */
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      correctOrientation: true,
      source: CameraSource.Camera,
      width: 1500,
      height: 1500,
      quality: quality
    });

    /* Saving the photo to the device. */
    const savedImageFile = await this.savePicture(capturedPhoto);

    return savedImageFile;
  }

  async editPicture(datas: any) {
    /* Creating a unique file name for the image. */
    // const fileName = new Date().getTime() + '.jpeg';
    /* Saving the image to the device. */
    const savedFile = await Filesystem.writeFile({
      path: `images-management-library-docs/${datas.fileName}`,
      data: datas.base64,
      directory: Directory.Data,
      recursive: true,
    });

    /* Returning the fileName and filepath. */
    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        fileName: datas.fileName,
        filepath: savedFile.uri,
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        fileName: datas.fileName,
        filepath: datas.fileName,
      };
    }
  }

  /**
   * Delete the file from the filesystem, and then remove the file from the array of files.
   * @param img - the image object that you want to delete
   */
  async deleteImage(img: PhotoInt) {
    await Filesystem.deleteFile({
      path: `images-management-library-docs/${img.fileName}`,
      directory: Directory.Data,
    });
  }

  async readFile(photo: any) {
    try {
      const file = await Filesystem.readFile({
        path: `images-management-library-docs/${photo.fileName}`,
        directory: Directory.Data,
      });
      return `data:image/jpeg;base64,${file?.data}`;
    } catch (error) {
      console.log(error);
    }
    return '';
  }

  private async savePicture(
    cameraPhoto: Photo
  ): Promise<Partial<PhotoInt> | null> {
    const fileName = new Date().getTime() + '.png';

    /* Compressing the image. */
    // const base64Data = await this.compressImage(cameraPhoto, fileName);
    const base64Data = cameraPhoto.dataUrl;

    if (base64Data) {
      // Write the file to the data directory
      /* Saving the image to the device. */
      try {
        const savedFile = await Filesystem.writeFile({
          path: `images-management-library-docs/${fileName}`,
          data: base64Data,
          directory: Directory.Data,
          recursive: true,
        });

        const fileInfo = await Filesystem.stat({
          path: `images-management-library-docs/${fileName}`,
          directory: Directory.Data,
        })

        this.isLoading.next(false);

        return {
          fileName,
          filepath: savedFile.uri,
          fileInfo
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    return null;

  }

  private async compressImage(
    cameraPhoto: Photo,
    fileName: string
  ): Promise<string | null> {
    const options = {
      maxSizeMB: 0.5,
      // maxWidthOrHeight: 500,
      // useWebWorker: true,
      initialQuality: 0.8,
    };
    if (cameraPhoto.dataUrl) {
      if (this.platform.is('hybrid')) {
        try {
          /* Converting the base64 string to a blob. */
          const file1 = await imageCompression.getFilefromDataUrl(
            cameraPhoto.dataUrl,
            fileName
          );

          /* Compressing the image. */
          const compressedFile = await imageCompression(file1, options);

          try {
            /* Converting the compressedFile to a base64 string. */
            return new Promise((resolve: any) => {
              const reader = this.getFileReader();
              reader.readAsDataURL(compressedFile);
              reader.onload = (imgsrc) => {
                const compressBase64 = (imgsrc.target as FileReader).result;
                resolve(compressBase64);
              };
            });
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
        this.isLoading.next(false);

        return cameraPhoto.dataUrl;
      } else {
        /* Converting the base64 string to a blob. */
        const file1 = await imageCompression.getFilefromDataUrl(
          cameraPhoto.dataUrl,
          fileName
        );

        try {
          /* Compressing the image. */
          const compressedFile2 = await imageCompression(file1, options);
          this.isLoading.next(false);

          /* Converting the compressedFile2 to a base64 string. */
          return (await this.convertBlobToBase64(compressedFile2)) as string;
        } catch (error) {
          console.log(error);
          this.isLoading.next(false);
        }
        this.isLoading.next(false);

        return cameraPhoto.dataUrl;
      }
    }
    return null;
  }

  private getFileReader(): FileReader {
    const fileReader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const zoneOriginalInstance = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ];
    return zoneOriginalInstance || fileReader;
  }

  /**
   * It converts a blob to a base64 string
   * @param {Blob} blob - The blob that you want to convert to base64.
   * @returns A promise that resolves to a base64 string.
   */
  private convertBlobToBase64(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
