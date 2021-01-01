const KakaoStrategy = require( 'passport-kakao' ).Strategy;

const { User } = require( '../models' );

module.exports = ( passport ) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디 인데 노출되면 안된다.
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터 주소
    }, async ( accessToken, refreshToken, profile, done ) => {
        try {
            const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
            if( exUser ){
                done( null, exUser );
            } else {
                // callbackURL의 주소로 accessToke, refreshToken, profile을 보낸다.
                // profile객체에서 원하는 정보를 꺼내서 회원가입을 하면 된다.
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done( null, newUser );
            }
        } catch (error) {
            console.error( error );
            done( error );
        }
    }));
};