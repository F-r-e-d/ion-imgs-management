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


