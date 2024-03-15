import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class ImagesManagementService {
  constructor() {}

  async listImages(path: string) {
    return await Filesystem.readdir({
      path: path,
      directory: Directory.Data,
    });
  }

  async getImageUri(path: string, name: string): Promise<string | null> {
    try {
      const img = await Filesystem.getUri({
        path: path + '/' + name,
        directory: Directory.Data,
      });

      return img.uri;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // async getImageBase64(path: string, name: string): Promise<string | null> {
  //   try {
  //     const img = await Filesystem.readFile({
  //       path: path + '/' + name,
  //       directory: Directory.Data,
  //     });

  //     return `data:image/jpeg;base64,${img?.data}`;

  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  async getImageSize(path: string, name: string): Promise<number | null> {
    try {
      const img = await Filesystem.stat({
        path: path + '/' + name,
        directory: Directory.Data,
      });

      return img.size/1000;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
