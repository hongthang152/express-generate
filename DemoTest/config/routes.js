var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var ThangTestRouter = require('../routes/ThangTest');
var SupBitchRouter = require('../routes/SupBitch');
var HeyRouter = require('../routes/Hey');
var LaooooRouter = require('../routes/Laoooo');

module.exports = (app) => {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/ThangTest',ThangTestRouter);
    app.use('/SupBitch',SupBitchRouter);
    app.use('/Hey',HeyRouter);
    app.use('/Laoooo',LaooooRouter);
    // !-- Do not remove this line --! //
};