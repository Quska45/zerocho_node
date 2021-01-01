const local = require( './localStrategy' );
const kakao = require( './kakaoStrategy' );
const { User } = require( '../models' );

module.exports = ( passport ) => {
    // serial, deserial이 passport를 이해하는 핵심이다.

    // 사용자 정보 객체를 세션에 아이디로 저장하기 위한 코드이다. 라우터에서 req.login을 통해 실행된다.
    // serializeUser는 req.session 객체에 어떤 데이터를 저장할지 선택한다.
    // done의 첫 번쨰 인자는 에러 처리를 위한 것이고 두 번째는 사용자 아이디를 저장한 것이다.
    // 사용자 정보를 전부 저장하면 용량 문제가 있을 수 있으니 id만 저장한 것이다.
    passport.serializeUser(( user, done ) => {
        done( null, user.id );
    });

    // 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오기 위한 코드이다.
    // 매 요청시 실행된다.
    // app.js의 passport.session() 미들웨어가 이 메서드를 호출한다.
    // 세션에 저장 했던 아이디를 받아 디비에서 사용자 정보를 조회한다.
    // 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.
    passport.deserializeUser(( id, done ) => {
        User.findOne({ where: { id } })
            .then( user => done( null, user ) )
            .catch( err => done( err ) );
    });

    local( passport );
    kakao( passport );
}