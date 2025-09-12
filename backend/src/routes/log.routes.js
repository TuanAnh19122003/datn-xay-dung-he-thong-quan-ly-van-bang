const express = require('express');
const router = express.Router();
const controller = require('../controllers/log.controller');

router.get('/', controller.findAll);
router.get('/search', controller.search);
router.post('/', controller.create);

module.exports = router;
