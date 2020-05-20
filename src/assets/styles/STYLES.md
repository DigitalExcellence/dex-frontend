# How to use the styles
In order to add an other file in this folder it should be specified in the angular.json file in the root of the project. Otherwise the file would not get preprocessed and compiled with Angular. In the angular.json you can find the following property:
```
projects -> dex-frontend -> architect -> build -> styles 
```
You should had a reference with the following syntax:
```json
"src/assets/styles/_buttons.scss",
```