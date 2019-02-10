#!/usr/bin/env node
!function(e){var r={};function n(o){if(r[o])return r[o].exports;var t=r[o]={i:o,l:!1,exports:{}};return e[o].call(t.exports,t,t.exports,n),t.l=!0,t.exports}n.m=e,n.c=r,n.d=function(e,r,o){n.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,r){if(1&r&&(e=n(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var t in e)n.d(o,t,function(r){return e[r]}.bind(null,t));return o},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},n.p="",n(n.s=9)}([function(e,r){e.exports="exports.getIndex = (req, res, next) => {\r\n    res.render('index', { title: 'Express' });\r\n}"},function(e,r){e.exports="var viewConfig = require('./config/view');\r\nvar errorConfig = require('./config/error');\r\nvar utilitiesConfig = require('./config/utilities');\r\nvar routesConfig = require('./config/routes');\r\n\r\nvar express = require('express');\r\n\r\nvar app = express();\r\n\r\nviewConfig(app);\r\nutilitiesConfig(app);\r\nroutesConfig(app);\r\nerrorConfig(app);\r\n\r\nmodule.exports = app;\r\n"},function(e,r){e.exports="var createError = require('http-errors');\r\n\r\nmodule.exports = (app) => {\r\n    app.use(function (req, res, next) {\r\n        next(createError(404));\r\n    });\r\n    \r\n    // error handler\r\n    app.use(function (err, req, res, next) {\r\n        // set locals, only providing error in development\r\n        res.locals.message = err.message;\r\n        res.locals.error = req.app.get('env') === 'development' ? err : {};\r\n    \r\n        // render the error page\r\n        res.status(err.status || 500);\r\n        res.render('error');\r\n    });\r\n};"},function(e,r){e.exports="var indexRouter = require('../routes/index');\r\n\r\nmodule.exports = (app) => {\r\n    app.use('/', indexRouter);\r\n    // !-- Do not remove this line --! //\r\n};"},function(e,r){e.exports="var logger = require('morgan');\r\nvar express = require('express');\r\nvar path = require('path');\r\nvar cookieParser = require('cookie-parser');\r\n\r\nmodule.exports = (app) => {\r\n    app.use(logger('dev'));\r\n    app.use(express.json());\r\n    app.use(express.urlencoded({ extended: false }));\r\n    app.use(cookieParser());\r\n    app.use(express.static(path.join(__dirname,'..','public')));\r\n};"},function(e,r){e.exports="var path = require('path');\r\n\r\nmodule.exports = (app) => {\r\n    app.set('views', path.join(__dirname,'..', 'views'));\r\n    app.set('view engine', 'ejs');\r\n};"},function(e,r){e.exports="var express = require('express');\r\nvar router = express.Router();\r\nvar indexController = require('../controllers/index.js');\r\n/* GET home page. */\r\nrouter.get('/', indexController.getIndex);\r\n\r\nmodule.exports = router;\r\n"},function(e,r){e.exports='exports.{{!--actionName--!}} = (req, res, next) => {\r\n    res.send("You have just reached action: {{!--actionName--!}}");\r\n}'},function(e,r){e.exports="var express = require('express');\r\nvar router = express.Router();\r\nvar {{!--routeName--!}}Controller = require('../controllers/{{!--routeName--!}}.js');\r\n\r\n// !-- Do not remove this line --! //\r\n\r\nmodule.exports = router;\r\n"},function(e,r,n){"use strict";n.r(r);var o=n(0),t=n.n(o),s=n(1),i=n.n(s),a=n(2),u=n.n(a),c=n(3),p=n.n(c),l=n(4),d=n.n(l),f=n(5),x=n.n(f),g=n(6),v=n.n(g),m=n(7),j=n.n(m),h=n(8),q=n.n(h),w=n(10),y=n(11),S=n(12);const b="controllers";y.config.silent=!0,w.command("new <name>").action(e=>{console.log("Checking for package.json .... "),y.exec("npm init -y"),y.exec("npm install express-generator -g --save"),y.exec("express --force --view=ejs "+e),y.cd(e),y.exec("npm install"),S.writeFile("./app.js",i.a,e=>{y.echo(e)}),y.mkdir("config"),y.cd("config"),y.touch("error.js"),y.touch("routes.js"),y.touch("utilities.js"),y.touch("view.js"),S.writeFile("./error.js",u.a),S.writeFile("./routes.js",p.a),S.writeFile("./utilities.js",d.a),S.writeFile("./view.js",x.a),y.cd(".."),y.mkdir(b),y.cd(b),y.touch("index.js"),S.writeFile("./index.js",t.a),y.cd("../routes"),y.rm("users.js"),S.writeFile("./index.js",v.a)}),w.command("generate [tool] <toolName> [toolActions...]").action((e,r,n)=>{switch(e){case"controller":!function(e,r,n){y.test("-d",b)||y.mkdir("controllers");y.cd(b);let o=r+".js";console.log("Controller Name: "+r),y.touch(o),console.log("Successfully generate controller with name: "+o),n.forEach(e=>{console.log(e);let r=j.a.replace(/{{!--actionName--!}}/g,e)+"\n\n",n=S.readFileSync(o);S.writeFileSync(o,n.toString()+r)})}(0,r,n),function(e,r,n){y.cd("../config");let o=S.readFileSync("routes.js").toString(),t=r+"Router",s=(o=o.replace(/\/\/ !-- Do not remove this line --! \/\//,e=>{let n="app.use('/"+r+"',"+t+");\n    "+e;return n})).match(/require\(.*\);/g),i=s[s.length-1];o=o.replace(i,i+"\nvar "+t+" = require('../routes/"+r+"');"),S.writeFileSync("routes.js",o)}(0,r),function(e,r,n){y.cd(".."),y.cd("routes"),y.touch(r+".js"),S.writeFileSync(r+".js",q.a.replace(/{{!--routeName--!}}/g,r));let o=S.readFileSync(r+".js").toString();n.forEach(e=>{o=o.replace(/\/\/ !-- Do not remove this line --! \/\//,n=>{let o="router.get('/"+e+"',"+r+"Controller."+e+");\n"+n;return o})}),S.writeFileSync(r+".js",o)}(0,r,n)}}),w.parse(process.argv)},function(e,r){e.exports=require("commander")},function(e,r){e.exports=require("shelljs")},function(e,r){e.exports=require("fs")}]);