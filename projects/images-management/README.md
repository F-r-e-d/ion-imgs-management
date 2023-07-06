# images-management
## Ionic 7 Angular 16

images-management is a Ionic 7 Angular 16 library. It's include grid diplay img, file picker, take-photo, edit picture....

## Installation


```bash
npm install images-management
npm install @capacitor/filesystem
npm install @capacitor/camera
npx cap sync
```

## Usage

```ts
import { ImagesManagementModule } from 'images-management';

import { NgModule} from '@angular/core';

@NgModule({
  imports: [
    ...
    ImagesManagementModule
  ],

})

# .ts
public imagesModel = [];


# .html
  <ion-imgs-management 
    [compress]="false" 
    [title]="'Photos'" 
    [(imagesModel)]="imagesModel">
  </ion-imgs-management>


```

# Properties
- imagesModel: Array => (ngModel)
   - fileName: string
   - filePath: string

- title (optional): string => (name of label input)
    default : ''

- compress (optionnal): boolean => (use compression system)
    default: false

# Utils
import { ImagesManagementService } from 'images-management';

  constructor(private imgManagementService: ImagesManagementService) {}


# Thanks to the wonderful librairies

- @meddv/ngx-pinch-zoom
- browser-image-compression
- markerjs2
- ngx-image-compress
- ngx-image-cropper
