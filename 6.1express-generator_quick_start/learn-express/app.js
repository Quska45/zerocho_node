var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require( 'express-session' );
var flash = require( 'connect-flash' );

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// express에서는 app 객체에 각종 기능을 연결한다고 볼 수 있다.
var app = express();

// view engine setup
// express 앱에 대한 설정이다.(set)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// express에 미들웨어를 연결하는 코드이다.(use)
// 아래 미들웨어들을 순차적으로 거쳐서 라우터에서 클라이언트로 응답을 보낸다.
app.use(function( req, res, next ){
  console.log( req.url, '저도 미들웨어입니다.' );
  // 미들웨어 안에서 반드시 next()를 호출해야만 다음으로 넘어간다.
  // 미들웨어의 흐름을 제어하는 핵심 함수 이다.
  // 몇 가지 기능이 더 있는데 인자의 종류로 기능이 구분 된다.
  // 인자를 넣지 않으면 단순히 다음 미들웨어로 넘어감
  // 인자로 router를 넣으면 특수한 기능을 한다.
  // router 외의 다른 값을 넣으면 다른 미들웨어나 라우터를 건너 뛰고 바로 에러 핸들러로 이동한다.
  next();
});
app.use(logger('dev'));
// express에 body-parser의 기능이 내장 되었기 때문에 다음과 같이 사용할 수 있다.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(cookieParser( 'secret code' ));
app.use(express.static(path.join(__dirname, 'public')));

// session 설정
app.use(session({
  resave: false, // 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지. 보통 방문자를 추적할 때 사용
  secret: 'secret code', // 필수 항목이다. cookie-parser의 ㅂ밀키와 같은 역할이다.
  // 세션 쿠키에 대한 설정이다. 일반적인 모든 쿠키옵션이 제공된다.
  // store도 사용할 수 있다. 보통 redis와 같이 사용하는데 나중에 책에서 설명한다.
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(flash());

// 라우팅 미들웨어는 여기처럼 첫 번째 인자로 주소를 받아서 특정 주소에 해당하는 요청이 왔을 때만 미들웨어가 작동하도록 한다.
// get, post, put, patch, delete 같은 http메서드도 사용할 수 있다. 이떄는 주소와 메서드까지 같아야 실행된다.
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // createError 내부적으로 404에러를 만들어 내고 이 에러를 next에 담아 에러 핸들러로 보낸다.(아래 error 핸들러이다.)
  next(createError(404));
});

// 다음과 같이 하나의 use로 여러개의 미들웨어를 추가 할 수 있다.
app.use(function( req, res, next ){
  console.log( '첫 번째 미들웨어' );
  next();
}, function( req, res, next ){
  console.log( '두 번째 미들웨어' );
  next();
}, function( req, res, next ){
  console.log( '세 번째 미들웨어' );
  next();
});

// error handler
// 나중에 템플릿 엔진 다룰 때 다시 배운다. 
// next함수에 넣어준 인자가 err의 매게 변수로 연결된다.
// 보통 에러 핸들러는 미들웨어의 마지막에 위치하고 없는 경우 express의 기본 핸들러가 처리한다.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
