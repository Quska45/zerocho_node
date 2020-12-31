const local = require( './localStrategy' );
const kakao = require( './kakaoStrategy' );
const { User } = require( '../models' );

module.exports = ( passport ) => {
    // serial, deserial이 passport를 이해하는 핵심이다.
    // serializeUser는 req.session 객체에 어떤 데이터를 저장할지 선택한다.
    passport.serializeUser(( user, done ) => {
        done( null, user.id );
    });

    passport.deserializeUser(( id, done ) => {
        User.findOne({ where: { id } })
            .then( user => done( null, user ) )
            .catch( err => done( err ) );
    });

    local( passport );
    kakao( passport );
}