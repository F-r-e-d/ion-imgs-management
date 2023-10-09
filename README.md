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



# Thanks to the wonderful libraries

- @meddv/ngx-pinch-zoom
- browser-image-compression
- markerjs2
- ngx-image-compress
- ngx-image-cropper


# debug
*cd dist/images-management*
*ng build --watch*
*cd dist/project*
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

# Build & publish
https://devdactic.com/build-ionic-library-npm


```root
ng build
```
cd dist/project
```
npm publish
```

# Pour verdaccio

```terminal
verdaccio
```

cd projects/project_name/package.json
"publishConfig": {
    "registry": "http://localhost:4873"
  },
  -> ng build
  -> npm publish in dist/project


