var indexRouter = require('../routes/index');
var ThangRouter = require('../routes/Thang');
var BinhRouter = require('../routes/Binh');

module.exports = (app) => {
    app.use('/', indexRouter);
    app.use('/Thang',ThangRouter);
    app.use('/Binh',BinhRouter);
    // !-- Do not remove this line --! //
};