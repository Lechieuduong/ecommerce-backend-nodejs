const compression = require('compression');
const express = require('express');
const { default: rateLimit } = require('express-rate-limit');
// tương tự với morgan là 1 middleware
// Sử dụng để bảo vệ các thông tin riêng tư của chúng ta, ngăn chặn các trang web đọc 
// cookie của chúng ta rất nhiều 
const { default: helmet } = require('helmet');
// morgan là 1 thư viện để in ra các log của chúng ta khi 1 người dùng chạy 1 cái restrict
const morgan = require('morgan');
const { checkOverload } = require('./helpers/check.connect');

const app = express();
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

// init middlewares
// middleware có 5 chế độ
app.use(morgan('dev'));
/**
 * Helmet là package npm: gồm 14 middleware nhỏ ở trong giúp xử lý, 
 * lọc các HTTP header độc hại (nhằm khai thác lỗ hổng XSS hay clickjacking, …)
 */
app.use(helmet());
app.use(compression());
app.use('/api/', apiLimiter);

// Nó sẽ đi theo tiêu chuẩn apache, khi sử dụng production thì sử dụng mode này
// morgan('combined');
// Gần giống combined nhưng không biết được resource
// morgan('common');
// Là thông báo mặc định ngắn hơn bao gồm thời gian phản hồi mà thôi
// morgan('short');
// Chỉ bao gồm phương thức , status và thời gian phản hồi
// morgan('tiny');

// init db
require('./dbs/init.mongodb');
checkOverload();
// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello';
    return res.status(200).json({
        message: 'Welcome',
        metadata: strCompress.repeat(10000)
    })
})
// handling error

module.exports = app;