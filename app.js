// package
const express      = require('express');
const session      = require('express-session');
const cors         = require('cors');
const cookieParser = require('cookie-parser')
const morgan       = require('morgan');
const path         = require('path');
const dotenv       = require('dotenv');

// swagger
const YAML        = require('yamljs');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'))

// config
const cookieOptions     = require('./config/secretKey').cookieOptions;
const configurePassport = require('./config/passport');

// routes
const { sequelize }     = require('./models');
const mainRouter        = require('./routes/main');
const postRouter        = require('./routes/post');
const boardRouter       = require('./routes/board');
const replyRouter       = require('./routes/reply');
const storeRouter       = require('./routes/store');
const userRouter        = require('./routes/user');
const majorRouter       = require('./routes/major');
const scholarShipRouter = require('./routes/scholarship');


dotenv.config();

const app = express();
const corsOptions = {
    origin: "https://hufspace.com",
    credentials: true
}

app.set('port', process.env.PORT || 80);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({cookieOptions}));
app.use(cors()); // corsOptions

configurePassport(app);

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
app.use('/store', storeRouter);
app.use('/user', userRouter);
app.use('/major', majorRouter);
app.use('/scholarship', scholarShipRouter);
app.use('/', mainRouter);

// API Document by using swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없음`);
    error.status = 404;
    next(error);
});

app.use((err,req,res,next)=>{
    const message = err.message;
    const error = process.env.NODE_ENV !== 'production'? err:{};
    res.status(500).json({
        data: "",
        message: message
    });
});

module.exports = app;