import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

// https://github.com/dfa1234/ngx-image-compress
import {
  DOC_ORIENTATION,
  NgxImageCompressService,
} from 'custom-ngx-image-compress';
import { PhotoInt } from '../../interfaces/PhotoInt';

@Injectable({
  providedIn: 'root',
})
export class FilepickerService {
  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';
 private orientation!: 'portrait' | 'landscape' | 'square';

  constructor(private imageCompress: NgxImageCompressService) {}

  async compressFile(
    path = 'images-management-library-docs',
    compress = false,
    accept = 'image/*',
    forceOrientation: undefined | Array<'portrait' | 'landscape' | 'square'> = undefined
  ) {
    const uploadFile = await this.imageCompress.uploadFile(accept);

    if (forceOrientation) {
      try {
        this.orientation = await this.detectImageOrientation(uploadFile.image);
        console.log(this.orientation);
      } catch (error) {
        console.log(error);
      }

      if (!forceOrientation.includes(this.orientation)) {

        throw 'Orientation incorrecte'
      }
    }

    // this.imageCompress.getOrientation(uploadFile.)

    if (compress) {
      const compressedImage = await this.imageCompress.compressFile(
        uploadFile.image,
        uploadFile.orientation,
        70,
        70
      ); // 50% ratio, 50% quality

      return await this.saveFile(path, compressedImage);
    }

    return await this.saveFile(path, uploadFile.image);
  }

  async saveFile(path: string, data: string): Promise<Partial<PhotoInt>> {
    // Write the file to the data directory
    // const ext = file.mimeType.split('/')[1];

    const ext = data?.split(';')[0].split('/')[1] || 'jpg';

    const fileName = new Date().getTime() + '.' + ext;

    const savedFile = await Filesystem.writeFile({
      path: `${path}/${fileName}`,
      data: data,
      directory: Directory.Data,
      recursive: true,
    });

    const fileInfo = await Filesystem.stat({
      path: `${path}/${fileName}`,
      directory: Directory.Data,
    });

    return {
      fileName,
      filepath: savedFile.uri,
      fileInfo,
    };
  }

  detectImageOrientation(base64Data: string): Promise<'portrait' | 'landscape' | 'square'> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width > height) {
          resolve('landscape');
        } else if (height > width) {
          resolve('portrait');
        } else {
          resolve('square');
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = base64Data;
    });
  }
}
