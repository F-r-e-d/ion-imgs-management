# images-management
## Ionic 7 Angular 16

images-management is a Ionic 7 Angular 16 library. It's include grid diplay img, file picker, take-photo, edit picture....

## Installation


```bash
npm install images-management
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



# Thanks to wonderfull packages

"@meddv/ngx-pinch-zoom"
"browser-image-compression"
"markerjs2"
"ngx-image-compress"
"ngx-image-cropper"


# debug
If module not found on test app
```Powershell
rmdir 'C:/Users/.../AppData/Roaming/npm/node_modules/images-management'
cd dist/images-management
npm unlink images-management
ng build --watch
MAYBE npm i in dist/project
npm link
```
Verify in "C:/Users/.../AppData/Roaming/npm/node_modules/images-management" if node_modules exist

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

