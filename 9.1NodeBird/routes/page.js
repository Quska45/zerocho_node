const express = require( 'express' );

const router = express.Router();

router.get( '/profile', ( req, res ) => {
    res.render( 'profile', {title: '내 정보 - NodeBird', user: null} );
} );

router.get( '/join', ( req, res, next ) => {
    res.render( 'join', {
        title: '회원가입 - NodeBird',
        user: null,
        joinError: req.flash( 'joinError' )
    } );
} );

router.get( '/', ( req, res, next ) => {
    res.render( 'main', {
        title: 'NodeBird',
        twits: [],
        user: null,
        loginError: req.flash( 'loginErorr' )
    } );
} );

module.exports = router;