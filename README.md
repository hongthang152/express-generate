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
- [express-generate](#express-generate)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)

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
  --version  Show version number                                         [boolean]
  --help     Show help                                                   [boolean]
```
