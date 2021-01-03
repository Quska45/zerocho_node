const express = require( 'express' );
const passport = require( 'passport' );
const bcrypt = require( 'bcrypt' );
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' );
const { User } = require( '../models' );

const router = express.Router();
router.post('/join', isNotLoggedIn, async ( req, res, next ) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if( exUser ){
            req.flash( 'joinError', 'ㅇㅣ미 가입된 이메일입니다.' );
            return res.redirect( '/join' );
        }

        const hash = await bcrypt.hash( password, 12 ); // crypto 모듈의 pbkdf2 메서드를 사용할 수도 있다.
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect( '/' );
    } catch (error) {
        console.error( error );
        return next( error );
    }
});

router.post('/login', isNotLoggedIn, ( req, res, next ) => {
    // 로컬 로그인 전략을 수행한다.
    // passport의 미들웨어가 라우터 미들웨어 안에 들어 있는 형태가 된다.
    // 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 이런 식으로 코딩하면 된다. 내부 미들웨어에 (req, res, next)를 인자로 호출하는 방식이다.
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error( authError );
            return next( authError );
        }
        if( !user ){
            req.flash( 'loginError', info.message );
            return res.redirect( '/' );
        }
        // passport는 req.login, req.logout을 추가한다.
        // req.login은 passport.serializaUser를 호출한다.
        // req.login의 user 객체가 serializaUser로 넘어가게 된다.
        return req.login(user, (loginError) => {
            if(loginError){
                console.error( loginError );
                return next( loginError );
            }
            return res.redirect( '/' );
        });
    })( req, res, next ); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, ( req, res ) => {
    req.logout();
    req.session.destroy();
    res.redirect( '/' );
});

router.get('/kakao', passport.authenticate( 'kakao' ));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRediredt: '/',
}), ( req, res ) => {
    res.redirect( '/' );
});

module.exports = router;