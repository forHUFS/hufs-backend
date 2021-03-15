const express = require('express');
const configurePassport = require('./config/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser')

const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const swaggerUi   = require('swagger-ui-express');
const YAML        = require('yamljs');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'))
const mainRouter = require('./routes/main');
const postRouter = require('./routes/post');
const boardRouter = require('./routes/board');
const replyRouter = require('./routes/reply');
const userRouter = require('./routes/user');

const { signUp } = require('./controller/user')

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(cookieParser())
app.use(
    session(
        {
            secret:'NDKBM9wwJ75jrBrCRQ-mqymO', // 쿠키 임의 변조 방지 -> 세션 암호화
            coocie: { 
                // expires: 기본 값은 클라이언트 종료
                maxAge: 60 * 60 * 1000, // expires 보다 우선 되는 쿠키 만료 시간
                httpOnly: true, // Javascript로 쿠키 접근 x
                secure: false // https인 경우만 접속
            },
            resave: false, // 세션을 언제나 저장할지 정하는 값
            saveUninitialized: true // 세션이 저장되기 전에 unitialized 상태로 미리 만들어서 저장
        }
    )
);

configurePassport(app)

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
app.use('/user', userRouter);

// app.get('/', (req, res) => {
//     res.send(`
//         <h3>Node Passport Social Login</h3>
//         <a href="/user/google">Login with Google</a>
//         <a href="/user/kakao">Login with Kakao</a>
//     `)
// })

// app.get('/user/sign-up', (req, res) => {
//     res.send(`
//         <form mehotd="POST" action="" id="form">
//             <p><input type="text" id="email" placeholder="email" /></p>
//             <p><input type="text" id="name" placeholder="name" /></p>
//             <p><input type="text" id="nickname" placeholder="nickname" /></p>
//             <p><input type="text" id="mainMajor" placeholder="mainMajor" /></p>
//             <p><input type="text" id="webMail" placeholder="webMail" /></p>
//             <p><button type="submit" id="target">제출</button>
//         </form> 
//     `)
// })


// app.post('/user/sign-up', fetch('/user/sign-up', {method: 'POST'}))

app.use(express.static(path.join(__dirname, 'views')));

// Social Login Test
// app.get('/', (req, res) => {
//     res.sendFile('test')
//   })


app.use('/', mainRouter);
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
