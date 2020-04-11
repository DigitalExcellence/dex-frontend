const fs = require('fs');
// Configure Angular `environment.ts` file path
const target = 'environment.prod.ts';
const targetPath = `./src/environments/${target}`;
// Load node modules
const colors = require('colors');
require('dotenv').load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: true,
   apiUrl: '${process.env.API_URL}',
   identityServerUrl: '${process.env.IDS_URL}',
};
`;
console.log(colors.magenta(`The file ${target} will be written with the following content: \n`));
console.log(colors.grey(envConfigFile));
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.magenta(`Angular ${target} file generated correctly at ${targetPath} \n`));
  }
});
