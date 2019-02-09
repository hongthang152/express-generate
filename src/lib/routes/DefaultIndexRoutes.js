var express = require('express');
var router = express.Router();

import * as exampleController from '../controllers/example.js';
/* GET home page. */
router.get('/', exampleController.getExample);

module.exports = router;
