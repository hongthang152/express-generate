var express = require('express');
var router = express.Router();
var BinhController = require('../controllers/Binh.js');

router.get('/getBinh',BinhController.getBinh);
router.get('/postBinh',BinhController.postBinh);
// !-- Do not remove this line --! //

module.exports = router;
