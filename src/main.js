
var program = require('commander'),
shell = require('shelljs'),
fs = require('fs');

import defaultControllerTemplate from 'raw-loader!./lib/controllers/DefaultController.js';
import defaultAppTemplate from 'raw-loader!./lib/DefaultApp.js';
import defaultErrorConfig from 'raw-loader!./lib/config/DefaultErrorConfig.js';
import defaultRoutesConfig from 'raw-loader!./lib/config/DefaultRoutesConfig.js';
import defaultUtilitiesConfig from 'raw-loader!./lib/config/DefaultUtilitiesConfig.js';
import defaultViewConfig from 'raw-loader!./lib/config/DefaultViewConfig.js';

const CONTROLLERS_DIR = 'controllers',
    CONFIG_DIR = 'config';

shell.config.silent = true;

program
    .command('new <name>')
    .action((name) => {
        console.log("Checking for package.json .... ");
        shell.exec('npm init -y');
        shell.exec('npm install express-generator -g --save');
        shell.exec('express --force --view=ejs ' + name);
        shell.cd(name);
        shell.exec('npm install');
        fs.writeFile('./app.js', defaultAppTemplate, (err) => {
            shell.echo(err);
        })
        shell.mkdir(CONFIG_DIR);
        shell.cd(CONFIG_DIR);

        shell.touch('error.js');
        shell.touch('routes.js');
        shell.touch('utilities.js');
        shell.touch('view.js');

        fs.writeFile('./error.js', defaultErrorConfig);
        fs.writeFile('./routes.js', defaultRoutesConfig);
        fs.writeFile('./utilities.js', defaultUtilitiesConfig);
        fs.writeFile('./view.js', defaultViewConfig);

        shell.cd('..');
        shell.mkdir(CONTROLLERS_DIR);
        shell.cd(CONTROLLERS_DIR);
        shell.touch('example.js');
        fs.writeFile('./example.js', defaultControllerTemplate);
    });

program
    .command('generate [tool] <toolName>')
    .action((tool, toolName) => {
        switch(tool) {
            case 'controller':
                if(!shell.test('-d', CONTROLLERS_DIR)) {
                    shell.mkdir('controllers');
                }

                shell.cd(CONTROLLERS_DIR);
                let fileName = toolName + '.js';
                console.log("Controller Name: " + toolName);
                shell.touch(fileName);
                console.log("Successfully generate controller with name: " + fileName);

                fs.writeFile(fileName, defaultControllerTemplate, (err) => {
                    if(err) {
                        throw err;
                    }
                });

                shell.cd('..');
                shell.cd('config');
                fs.readFile('routes.js', (err, data) => {
                    let routerVarName = toolName + "Router";
                    let content = data.toString();
                    content = content.replace(/\/\/ !-- Do not remove this line --! \/\//, (match) => {
                        let returnValue = "app.use('/" + toolName + "'," + routerVarName + ");\n    " + match;
                        return returnValue; 
                    });
                    let requireMatches = content.match(/require\(.*\);/g);
                    let lastMatch = requireMatches[requireMatches.length - 1];
                    content = content.replace(lastMatch, lastMatch + "\nvar " + routerVarName + " = require('../routes/" + toolName + "');");
                    
                    fs.writeFile('./routes.js', content, err => {
                        if(err) shell.echo(err);
                    })
                })
        }
    });
    

program.parse(process.argv);

// Create a separate config folder for app.js


// var content;
// // First I want to read the file
// fs.readFile('src/lib/test.txt', function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     content = data.toString();
//     console.log(content);   // Put all of the code here (not the best solution)

//     // Invoke the next step here however you like
//     fs.writeFile('src/lib/test.txt', content + `\r\nconsole.log('This is a test')`, function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("The file was saved!");
//     })
// });


