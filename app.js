// package
const express      = require('express');
const cookieParser = require('cookie-parser')
const morgan       = require('morgan');
const path         = require('path');
const dotenv       = require('dotenv');

// swagger
const YAML        = require('yamljs');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'))

// config
const configurePassport = require('./config/passport');

// routes
const { sequelize } = require('./models');
const mainRouter    = require('./routes/main');
const postRouter    = require('./routes/post');
const boardRouter   = require('./routes/board');
const replyRouter   = require('./routes/reply');
const userRouter    = require('./routes/user');


dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(cookieParser());

configurePassport(app)

sequelize.sync({force:false})
    .then(()=>{
        console.log('데이터 베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });


// For Login Flow Test
app.use(express.static(path.join(__dirname, 'views')));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/post', postRouter);
app.use('/board', boardRouter);
app.use('/reply', replyRouter);
app.use('/user', userRouter);
app.use('/', mainRouter);

// API Document by using swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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