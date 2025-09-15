const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');
const upload = require('../utils/multer');

router.get('/', controller.findAll);
router.get('/:code/certs', controller.getCertsByStudentCode);
router.get('/count', controller.count);
router.get('/search', controller.search);
router.get('/by-major', controller.statsByMajor);
router.post('/', upload.single('image'), controller.create);
router.put('/:id', upload.single('image'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;