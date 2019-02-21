var program = require("commander"),
  shell = require("shelljs"),
  fs = require("fs"),
  inquirer = require("inquirer"),
  term = require("terminal-kit").terminal;

import defaultControllerTemplate from "raw-loader!./lib/controllers/DefaultController.js";
import defaultAppTemplate from "raw-loader!./lib/DefaultApp.js";
import defaultErrorConfig from "raw-loader!./lib/config/DefaultErrorConfig.js";
import defaultRoutesConfig from "raw-loader!./lib/config/DefaultRoutesConfig.js";
import defaultUtilitiesConfig from "raw-loader!./lib/config/DefaultUtilitiesConfig.js";
import defaultViewConfig from "raw-loader!./lib/config/DefaultViewConfig.js";
import defaultDatabaseConfig from "raw-loader!./lib/config/DefaultDatabaseConfig.txt";
import defaultRoutesTemplate from "raw-loader!./lib/routes/DefaultIndexRoutes.js";

import ControllerTemplate from "raw-loader!./lib/controllers/ControllerTemplate.js";
import RoutesTemplate from "raw-loader!./lib/routes/RoutesTemplate.js";

const CONTROLLERS_DIR = "controllers",
  CONFIG_DIR = "config",
  ROUTES_DIR = "routes",
  SEQUELIZE_CLI = "sequelize";

shell.config.silent = false;

program.command("new <name>").action(name => {
  console.log("Installing express-generator ...");
  shell.exec("npm install express-generator -g");
  console.log("Creating express project ...");

  let viewEngine;

  inquirer.prompt([{
    type: 'list',
    name: 'viewEngine',
    message: 'Which view engine you want to use ?',
    default: 'no-view',
    choices: ['ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig', 'vash']
  }]).then(answers => {
    viewEngine = answers.viewEngine;

    shell.exec("express --force --view=" + viewEngine + " " + name);

    shell.cd(name);
    shell.exec("npm install");
    shell.exec("npm install sqlite3 --save");
    shell.exec("npm install sequelize --save");
    shell.exec("npm install sequelize-cli -g --save");
    shell.exec(SEQUELIZE_CLI + " init");

    fs.writeFileSync("./app.js", defaultAppTemplate, err => {
      shell.echo(err);
    });

    shell.mkdir(CONTROLLERS_DIR);

    shell.cd(CONFIG_DIR);
    fs.writeFileSync("./config.json", defaultDatabaseConfig);
    shell.touch("error.js");
    shell.touch("routes.js");
    shell.touch("utilities.js");
    shell.touch("view.js");
    shell.touch("config.json");

    fs.writeFileSync("./error.js", defaultErrorConfig);
    fs.writeFileSync("./routes.js", defaultRoutesConfig);
    fs.writeFileSync("./utilities.js", defaultUtilitiesConfig);
    fs.writeFileSync("./view.js", defaultViewConfig.replace('{{!--view_engine--}}', viewEngine));

    shell.cd("..");
    shell.cd(CONTROLLERS_DIR);
    shell.touch("index.js");
    fs.writeFileSync("./index.js", defaultControllerTemplate);

    shell.cd("../routes");
    shell.rm("users.js");
    fs.writeFileSync("./index.js", defaultRoutesTemplate);
  })
});

program
  .command("db:migrate", "Run migrations for database")
  .action(() => {
    let command = SEQUELIZE_CLI + " db:migrate";
    shell.exec(command);
  })

program
  .command("generate <tool> <toolName> [toolActions...]", "")
  .action((tool, toolName, toolActions) => {
    if (!checkInsideProject()) {
      console.error("Error: You are not in a valid express-generate project");
      return;
    };

    switch (tool) {
      case "controller":
        shell.config.silent = true;
        if (checkControllerExist(toolName)) {
          console.error("Error: Controller " + toolName + " already exists.");
          return;
        }
        modifyControllerFolder(tool, toolName, toolActions);
        modifyRoutesFolder(tool, toolName, toolActions);
        modifyConfigFolder(tool, toolName, toolActions);
        shell.config.silent = false;
        break;
      case "model":
        let command = SEQUELIZE_CLI + " model:generate --name " + toolName + " --attributes ";
        toolActions.forEach((attribute, index, array) => {
          if (array.length - 1 == index) {
            command += attribute;
            return;
          }
          command += (attribute + ",");
        })
        shell.exec(command);
        break;
    }
  });

function checkInsideProject() {
  let checkRootValid = shell.test("-e", "bin") &&
    shell.test("-e", "config") &&
    shell.test("-e", "controllers") &&
    shell.test("-e", "node_modules") &&
    shell.test("-e", "routes") &&
    shell.test("-e", "views") &&
    shell.test("-e", "app.js") &&
    shell.test("-e", "package-lock.json") &&
    shell.test("-e", "package.json");

  shell.cd(CONFIG_DIR);

  let isInsideProject = checkRootValid &&
    shell.test("-e", "error.js") &&
    shell.test("-e", "routes.js") &&
    shell.test("-e", "utilities.js") &&
    shell.test("-e", "view.js");

  shell.cd("..");
  return isInsideProject;
}

function checkControllerExist(toolName) {
  let fileName = toolName + ".js";

  shell.cd(CONTROLLERS_DIR);
  if (shell.test("-e", fileName)) {
    return true;
  }

  shell.cd('..');
  shell.cd(CONFIG_DIR);
  let configContent = fs.readFileSync('routes.js').toString();
  let regex = new RegExp("app.use('/" + toolName + "')");
  if (configContent.match(regex)) {
    return true;
  }

  shell.cd('..');
  shell.cd(ROUTES_DIR);
  if (shell.test("-e", fileName)) {
    return true
  }
  shell.cd('..');

  return false;
}

function modifyRoutesFolder(tool, toolName, toolActions) {
  let routeFileName = toolName + ".js";

  shell.cd("..");
  shell.cd("routes");
  shell.touch(routeFileName);

  fs.writeFileSync(
    routeFileName,
    RoutesTemplate.replace(/{{!--routeName--!}}/g, toolName)
  );
  let content = fs.readFileSync(routeFileName).toString();

  content = content.replace(
    /\/\/ !-- Do not remove this line --! \/\//,
    match => {
      let returnValue = "router.all('/'," + toolName + "Controller.getIndex" + ");\n" + match;
      return returnValue;
    }
  );

  toolActions.forEach(toolAction => {
    content = content.replace(
      /\/\/ !-- Do not remove this line --! \/\//,
      match => {
        let returnValue = "router.all('/" + toolAction + "'," + toolName + "Controller." + toolAction + ");\n" + match;
        return returnValue;
      }
    );
  });
  fs.writeFileSync(routeFileName, content);
}


function modifyConfigFolder(tool, toolName, toolActions) {
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
  if (!shell.test("-e", CONTROLLERS_DIR)) {
    shell.mkdir("controllers");
  }

  shell.cd(CONTROLLERS_DIR);
  let fileName = toolName + ".js";

  if (shell.test("-e", fileName)) {
    return true;
  }

  console.log("Controller Name: " + toolName);
  shell.rm(fileName);
  shell.touch(fileName);
  console.log("Successfully generate controller with name: " + fileName);
  let content =
    ControllerTemplate.replace(/{{!--actionName--!}}/g, "getIndex") +
    "\n\n";
  let data = fs.readFileSync(fileName);
  fs.writeFileSync(fileName, data.toString() + content);
  toolActions.forEach(toolAction => {
    let content =
      ControllerTemplate.replace(/{{!--actionName--!}}/g, toolAction) +
      "\n\n";
    let data = fs.readFileSync(fileName);
    fs.writeFileSync(fileName, data.toString() + content);
  });
}

program.on('command:*', function () {
  term.red('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

program.on('--help', () => {
  console.log('');
  term.bold.underline('express-generate CLI');
  console.log('');
  console.log('');
  term.brightBlue('Commands:');
  console.log('');
  term('  express-generate new <Project Name>                                   Create a new express-generate project');
  console.log('');
  term('  express-generate generate controller <Controller Name> [Actions...]   Create a new controller with the defined actions');
  console.log('');
  term('  express-generate generate model <field-name>:<data-type>              Create a new model with the predefined fields');
  console.log('');
  term('  express-generate db:migrate                                           Running migrations for database');
  console.log('');
  console.log('');
  term.brightYellow.bold('Disclaimer: We use Sequelize CLI behind the scene to support ORM. If you want to use Sequelize CLI instead of using ours CLI, you are welcome to do so.');
  console.log('');
  term.brightYellow.bold('Type "sequelize --help" to get more information');
  console.log('');
})

program.parse(process.argv);
