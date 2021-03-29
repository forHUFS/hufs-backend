// package
const express      = require('express');
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

app.use(cors());

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(cookieParser());

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/test', (req, res) => {
    /**
     * req.user가 있는 경우는 소셜 로그인에 성공한 경우
     * passport에 의해 user가 주입됨 (deserialize 확인)
     */
    if (req.user) {
      res.send(`
          <h3>Login Success</h3>
          <a href="/auth/logout">Logout</a>
          <p>
              ${JSON.stringify(req.user, null, 2)}
          </p>
        `)
    } else {
      res.send(`
          <h3>Node Passport Social Login</h3>
          <a href="/user/sign-in/google">Login with Google+</a>
          <a href="/auth/login/facebook">Login with Facebook</a>
          <a href="/auth/login/naver">Login with Naver</a>
          <a href="/auth/login/kakao">Login with Kakao</a>
      `)
    }
  })


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