const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcrypt' );

const { User } = require( '../models' );

module.exports = ( passport ) => {
    passport.use(new LocalStrategy({
        // 아래 속성과 req.body에서 일치하는 속성명을 적어주면 된다.
        usernameField: 'email',
        passwordField: 'password',
    }, async ( email, password, done ) => { //done은 passport.authenticate의 콜백 함수다.
        try {
            const exUser = await User.findOne({ where: { email } });
            if( exUser ){
                const result = await bcrypt.compare( password, exUser.password );
                if( result ){
                    done( null, exUser );
                } else {
                    done( null, false, { message: '비밀번호가 일치하지 않습니다.' } );
                }
            } else {
                done( null, false, { message: '가입되지 않은 회원입니다.' } );
            }
        } catch(error) {
            console.error( error );
            done( error );
        }
    }))
};