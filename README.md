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
- ratio (optionnal): number => (if compress === true)
    default: 50
- qualityPicker (optionnal): number => (if compress === true)
    default: 50

- multiple (optionnal): boolean => (allow several picture)
    default: true

- textMarkers (optionnal): boolean => (display text marker)
    default: false

- reorderable (optionnal): boolean => (allow reorder pictures)
    default: true

- pickerForceOrientation(optionnal)="['landscape', 'square']" => => (picker accept only orientation)

- takePhotoForceOrientation="'landscape'"(optionnal)="['landscape']" => => (take photo accept only orientation)

# Utils
import { ImagesManagementService } from 'images-management';

  constructor(private imgManagementService: ImagesManagementService) {}



# Thanks to the wonderful libraries

- @meddv/ngx-pinch-zoom
- browser-image-compression
- markerjs2
- ngx-image-compress
- ngx-image-cropper


# debug
*cd project/images-management*
*ng build --watch*
*cd dist/images-management*
*npm link*

in test app :
-> Install all dependencies
-> *npm link images-management*

OLD:
<!-- If module not found on test app
```Powershell
npm root -g
rmdir 'C:/Users/.../AppData/Roaming/npm/node_modules/images-management'
cd dist/images-management
npm unlink images-management
ng build --watch (at root)
MAYBE npm i in dist/project
npm link
```
Verify in "C:/Users/.../AppData/Roaming/npm/node_modules/images-management" if node_modules exist -->


# Pour verdaccio

```terminal
verdaccio
```

# Build & publish
https://devdactic.com/build-ionic-library-npm

Increase projects\images-management\package.json version

```root
ng build
```
cd dist/project
```
npm publish
```


cd projects/project_name/package.json
"publishConfig": {
    "registry": "http://localhost:4873"
  },
  -> ng build
  -> npm publish in dist/project


