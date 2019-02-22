# express-generate

[![npm version](https://badge.fury.io/js/express-generate.svg)](https://badge.fury.io/js/express-generate)

An Express project generator with Rails like command-line interface that is easy to use. To get started: 
```bash
$ npm install express-generate
$ express-generate new <project-name>
$ *waiting intensifies*
$ cd <project-name>
$ npm start
```
Your Express project will be ready within 1 minute of installing. You will have access to
- SQLite with Sequelize ORM support
- View engine of your choice when initializing project

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#Examples)

## Installation
Install CLI
```bash
$ npm install express-generate
```

## Usage
```
express-generate CLI

Commands:
  express-generate new <Project Name>                                    Create a new Express project with Project Name
  express-generate generate controller <Controller Name> [Actions...]    Create a new controller with the defined actions
  express-generate generate model <field-name>:<data-type>               Create a new model with the predefined fields
  express-generate db:migrate                                            Running migrations for database
Options:
  --version  Show version number                                         
  --help     Show help                                                   
```
## Example
Create a simple project and run it
- Creating a project named Test
```bash
$ express-generate new Test
```
- Start Express server
```bash
$ cd Test
$ npm start
```
---
Create a simple User controller with 2 nested action: getUser and postUser

- Inside the project folder, type:
```bash
$ express-generate generate controller User getUser postUser
$ npm start
```
This should generate User.js under ./controller and ./routes folders.

- Go to your browser. Try:

[localhost:3000/User](localhost:3000/User)

[localhost:3000/User/getUser](localhost:3000/User/getUser)

[localhost:3000/User/postUser](localhost:3000/User/postUser)

Your URL enpoint should be there.

---
Create simple User model with 2 fields: username, password

- Inside the project folder, type:

```bash
$ express-generate generate model User username:string password:string
$ express-generate db:migrate
```
This should generate User.js under ./model folder.

- To use User model, your javascript code must require the index.js file in the model folder. 

We use it to import the model. For example.

```javascript
var db = require('../models/index');
var User = db.sequelize.import('../models/user.js');

// -- Inserting User into database
//User.create({
//    username: 'John',
//    password: 'Doe'
//})

// -- Find all users having the condition
// User.findAll({
//     where: {
//         username: 'John',
//         password: 'Doe'
//     }
// });
```

Disclaimer: We use Sequelize CLI behind the scene to support ORM. If you want to use Sequelize CLI instead of using ours CLI, you are welcome to do so.

Type "sequelize --help" to get more information



