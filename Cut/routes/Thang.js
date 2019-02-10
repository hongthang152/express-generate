var express = require('express');
var router = express.Router();
var ThangController = require('../controllers/Thang.js');

router.get('/getThang',ThangController.getThang);
router.get('/postThang',ThangController.postThang);
// !-- Do not remove this line --! //

module.exports = router;
