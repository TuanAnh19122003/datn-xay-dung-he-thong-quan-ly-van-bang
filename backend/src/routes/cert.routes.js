const express = require('express');
const router = express.Router();
const controller = require('../controllers/cert.controller');

router.get('/', controller.findAll);
router.get('/search', controller.search);
router.get('/:id/print', controller.print);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;