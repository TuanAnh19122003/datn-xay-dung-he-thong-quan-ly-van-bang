const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const departmentRouter = require('./department.routes');
const majorRouter = require('./major.routes');
const templateRouter = require('./template.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/departments', departmentRouter);
router.use('/majors', majorRouter);
router.use('/templates', templateRouter);

module.exports = router;