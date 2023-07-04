import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class ImagesManagementService {
  constructor() {}

  async listImages() {
    return await Filesystem.readdir({
      path: 'images-management-library-docs',
      directory: Directory.Data,
    });
  }

  async getImageUri(name: string): Promise<string | null> {
    try {
      const img = await Filesystem.getUri({
        path: 'images-management-library-docs/' + name,
        directory: Directory.Data,
      });

      return img.uri;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getImageBase64(name: string): Promise<string | null> {
    try {
      const img = await Filesystem.readFile({
        path: 'images-management-library-docs/' + name,
        directory: Directory.Data,
      });

      return `data:image/jpeg;base64,${img?.data}`;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  async getImageSize(name: string): Promise<number | null> {
    try {
      const img = await Filesystem.stat({
        path: 'images-management-library-docs/' + name,
        directory: Directory.Data,
      });

      return img.size/1000;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
