const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const mainRouter = require('./routes/main');
const postRouter = require('./routes/post');
const boardRouter = require('./routes/board');
const replyRouter = require('./routes/reply');


dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8004)

app.use(morgan('dev'));

sequelize.sync({force:false})
    .then(()=>{
        console.log('데이터 베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/post', postRouter);
app.use('/board', boardRouter);
app.use('/reply', replyRouter);
app.use('/', mainRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없음`);
    error.status = 404;
    next(error);
});
app.use((err,req,res,next)=>{
    const message = err.message;
    const error = process.env.NODE_ENV !== 'production'? err:{};
    res.status(err.status||500).json({message: message, error:error});

});

module.exports = app;
