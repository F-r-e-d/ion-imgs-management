import { Pipe, PipeTransform } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { PhotoInt } from '../../interfaces/PhotoInt';

@Pipe({
  name: 'readFile'
})
export class ReadFilePipe implements PipeTransform {

  async transform(photo: Partial<PhotoInt>, update: string = ''): Promise<string> {
    return await this.readFile(photo);
  }

  async readFile(photo: any) {
    try {
      const file = await Filesystem.readFile({
        path: `images-management-library-docs/${photo.fileName}`,
        directory: Directory.Data,
      });
      return `data:image/jpeg;base64,${file?.data}`
    } catch (error) {
      console.log(error);
    }
    return '';
  }

}
