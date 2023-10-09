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

  async compressFile(path = 'images-management-library-docs', compress = false) {
    const uploadFile = await this.imageCompress.uploadFile();

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
    })

    return {
      fileName,
      filepath: savedFile.uri,
      fileInfo
    };
  }
}
