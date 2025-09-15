const express = require('express');
const router = express.Router();
const controller = require('../controllers/cert.controller');

router.get('/', controller.findAll);
router.get('/search', controller.search);
router.get('/count', controller.count);
router.get('/stats-by-status', controller.certStatsByStatus);
router.get('/stats-by-year', controller.certStatsByYear);
router.get('/:id/print', controller.print);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;