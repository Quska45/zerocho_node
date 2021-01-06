const express = require( 'express' );
const cookieParser = require( 'cookie-parser' );
const morgan = require( 'morgan' );
const path = require( 'path' );
const session = require( 'express-session' );
const flash = require( 'connect-flash' );
const passport = require( 'passport' );
// 서버 시작 시 .env의 비밀키들을 process.env에 넣는다. 
// env에 있는 파일들을 사용할 수 있다.
require( 'dotenv' ).config();

const pageRouter = require( './routes/page' );
const authRouter = require( './routes/auth' );
const postRouter = require( './routes/post' );
const userRouter = require( './routes/user' );
const { sequelize } = require( './models' ); // 서버와 모델 연결을 위한 객체 require
const passportConfig = require( './passport' ); // index.js는 생략 된다는 것을 생각하자.

const app = express();
sequelize.sync(); // 서버와 모델 연결
passportConfig( passport );

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );
app.set( 'port', process.env.PORT || 8081 );

app.use( morgan( 'dev' ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( '/img', express.static( path.join( __dirname, 'uploads' ) ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
//app.use( cookieParser( 'nodebirdsecret' ) );
app.use( cookieParser( process.env.COOKIE_SECRET ) );
app.use(session({
    resave: false,
    saveUninitialized: false,
    //secret: 'nodebirdsecret',
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use( flash() );
app.use( passport.initialize() ); // 미들 웨어 요청에 passport설정을 심는다.
// req.session에 passport 정보를 저장한다.
// express-session이 생성해주는 req.session에 값이 저장 되기 때문에 express-session 미들웨어 뒤에 위치해야 한다.
app.use( passport.session() );

app.use( '/', pageRouter );
app.use( '/auth', authRouter );
app.use( '/post', postRouter );
app.use( '/user', userRouter );

app.use(( req, res, next ) => {
    const err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
});

app.use(( err, req, res, next ) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};
    res.status( err.status || 500 );
    res.render( 'error' );
});

app.listen(app.get( 'port' ), () => {
    console.log( app.get( 'port' ), '번 포트에서 대기 중' );
});