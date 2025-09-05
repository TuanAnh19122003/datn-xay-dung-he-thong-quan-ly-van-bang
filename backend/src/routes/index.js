const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const departmentRouter = require('./department.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/departments', departmentRouter);

module.exports = router;