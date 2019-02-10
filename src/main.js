var program = require("commander"),
  shell = require("shelljs"),
  fs = require("fs");

import defaultControllerTemplate from "raw-loader!./lib/controllers/DefaultController.js";
import defaultAppTemplate from "raw-loader!./lib/DefaultApp.js";
import defaultErrorConfig from "raw-loader!./lib/config/DefaultErrorConfig.js";
import defaultRoutesConfig from "raw-loader!./lib/config/DefaultRoutesConfig.js";
import defaultUtilitiesConfig from "raw-loader!./lib/config/DefaultUtilitiesConfig.js";
import defaultViewConfig from "raw-loader!./lib/config/DefaultViewConfig.js";
import defaultRoutesTemplate from "raw-loader!./lib/routes/DefaultIndexRoutes.js";

import ControllerTemplate from "raw-loader!./lib/controllers/ControllerTemplate.js";
import RoutesTemplate from "raw-loader!./lib/routes/RoutesTemplate.js";

const CONTROLLERS_DIR = "controllers",
  CONFIG_DIR = "config";

shell.config.silent = true;

program.command("new <name>").action(name => {
  console.log("Checking for package.json .... ");
  shell.exec("npm init -y");
  shell.exec("npm install express-generator -g --save");
  shell.exec("express --force --view=ejs " + name);
  shell.cd(name);
  shell.exec("npm install");
  fs.writeFile("./app.js", defaultAppTemplate, err => {
    shell.echo(err);
  });
  shell.mkdir(CONFIG_DIR);
  shell.cd(CONFIG_DIR);

  shell.touch("error.js");
  shell.touch("routes.js");
  shell.touch("utilities.js");
  shell.touch("view.js");

  fs.writeFile("./error.js", defaultErrorConfig);
  fs.writeFile("./routes.js", defaultRoutesConfig);
  fs.writeFile("./utilities.js", defaultUtilitiesConfig);
  fs.writeFile("./view.js", defaultViewConfig);

  shell.cd("..");
  shell.mkdir(CONTROLLERS_DIR);
  shell.cd(CONTROLLERS_DIR);
  shell.touch("index.js");
  fs.writeFile("./index.js", defaultControllerTemplate);

  shell.cd("../routes");
  shell.rm("users.js");
  fs.writeFile("./index.js", defaultRoutesTemplate);
});

program
  .command("generate [tool] <toolName> [toolActions...]")
  .action((tool, toolName, toolActions) => {
    switch (tool) {
      case "controller":
        modifyControllerFolder(tool, toolName, toolActions);
        modifyConfigFolder(tool, toolName, toolActions);
        modifyRoutesFolder(tool, toolName, toolActions);
    }
  });

function modifyRoutesFolder(tool, toolName, toolActions) {
  shell.cd("..");
  shell.cd("routes");
  shell.touch(toolName + ".js");

  fs.writeFileSync(
    toolName + ".js",
    RoutesTemplate.replace(/{{!--routeName--!}}/g, toolName)
  );
  let content = fs.readFileSync(toolName + ".js").toString();

  toolActions.forEach(toolAction => {
    content = content.replace(
      /\/\/ !-- Do not remove this line --! \/\//,
      match => {
        let returnValue = "router.get('/" + toolAction + "'," + toolName + "Controller." + toolAction + ");\n" + match;
        return returnValue;
      }
    );
  });
  fs.writeFileSync(toolName + ".js", content);
}

function modifyConfigFolder(tool, toolName, toolActions)  {
  shell.cd("../config");
  let content = fs.readFileSync("routes.js").toString();
  let routerVarName = toolName + "Router";
  content = content.replace(
    /\/\/ !-- Do not remove this line --! \/\//,
    match => {
      let returnValue =
        "app.use('/" +
        toolName +
        "'," +
        routerVarName +
        ");\n    " +
        match;
      return returnValue;
    }
  );

  let requireMatches = content.match(/require\(.*\);/g);
  let lastMatch = requireMatches[requireMatches.length - 1];
  content = content.replace(
    lastMatch,
    lastMatch +
    "\nvar " +
    routerVarName +
    " = require('../routes/" +
    toolName +
    "');"
  );

  fs.writeFileSync("routes.js", content);
}

function modifyControllerFolder(tool, toolName, toolActions) {
  if (!shell.test("-d", CONTROLLERS_DIR)) {
    shell.mkdir("controllers");
  }

  shell.cd(CONTROLLERS_DIR);
  let fileName = toolName + ".js";
  console.log("Controller Name: " + toolName);
  shell.touch(fileName);
  console.log("Successfully generate controller with name: " + fileName);
  // let content = '';
  toolActions.forEach(toolAction => {
    console.log(toolAction);
    let content =
      ControllerTemplate.replace(/{{!--actionName--!}}/g, toolAction) +
      "\n\n";
    let data = fs.readFileSync(fileName);
    fs.writeFileSync(fileName, data.toString() + content);
  });
}

program.parse(process.argv);

// Fix the issue with import and export

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
