import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

// https://github.com/dfa1234/ngx-image-compress
import { NgxImageCompressService } from 'ngx-image-compress';
import { PhotoInt } from '../../interfaces/PhotoInt';

@Injectable({
  providedIn: 'root',
})
export class FilepickerService {
  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';

  constructor(private imageCompress: NgxImageCompressService) {}

  async compressFile(compress = false) {
    const uploadFile = await this.imageCompress.uploadFile();

    if (compress) {
      const compressedImage = await this.imageCompress.compressFile(
        uploadFile.image,
        uploadFile.orientation,
        70,
        70
      ); // 50% ratio, 50% quality

      return await this.saveFile(compressedImage);
    }

    return await this.saveFile(uploadFile.image);
  }

  async saveFile(data: string): Promise<Partial<PhotoInt>> {
    // Write the file to the data directory
    // const ext = file.mimeType.split('/')[1];

    const ext = data?.split(';')[0].split('/')[1] || 'jpg';

    const fileName = new Date().getTime() + '.' + ext;

    const savedFile = await Filesystem.writeFile({
      path: `images-management-library-docs/${fileName}`,
      data: data,
      directory: Directory.Data,
      recursive: true,
    });

    const fileInfo = await Filesystem.stat({
      path: `images-management-library-docs/${fileName}`,
      directory: Directory.Data,
    })

    return {
      fileName,
      filepath: savedFile.uri,
      fileInfo
    };
  }
}
