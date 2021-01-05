const express = require( 'express' );
// multipart 데이터를 업로드하는 라우터에 붙는 미들웨어다.
const multer = require( 'multer' );
const path = require( 'path' );
const fs = require( 'fs' );
const encode = require( 'urlencode' );

const { Post, Hashtag, User } = require( '../models' );
const { isLoggedIn } = require( './middlewares' );
const { extname } = require('path');
const url = require('url');

const router = express.Router();
fs.readdir('uploads', ( error ) => {
    if(error){
        console.log( 'uploads 폴더가 없어 uploads 폴더를 생성합니다.' );
        fs.mkdirSync( 'uploads' );
    }
});

// upload는 미들웨어를 만드는 객체가 된다.
// 노드 교과서 383페이지에 multer의 미들웨어에 대한 설명이 되어 있다. 필요할 떄 참고 하기.
const upload = multer({
    // 파일 저장 방식과 경로, 파일명등을 설정할 수 있다.
    storage: multer.diskStorage({ // 이미지가 서버에 저장될 수 있도록 한다.
        destination( req, file, cb ){ // nodebird 아래 uploads폴더에 저장되도록 한다.
            cb( null, 'uploads/' );
        },
        filename( req, file, cb ){
            const ext = path.extname( file.originalname );
            cb( null, path.basename( file.originalname, ext ) + Date.now() + ext ); // 파일 이름을 만드는 코드다.
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드를 처리하는 라우터이다.
// single 미들 웨어를 사용하고 있다.
// req.file 객체를 확인해보면 상세한 정보를 확인 할 수 있다.
router.post('/img', isLoggedIn, upload.single( 'img' ), ( req, res ) => {
        console.log( req.file );
        var fileName = encode.decode( req.file.filename );
        res.json({ url: `/img/${ fileName }` });
});

// 게시글 업로드를 처리하는 라우터이다.
// 이미지 업로드시 이미지 주소도 req.body.url로 전송되고 이미지가 아니라 경로를 받았기 때문에 none 미들웨어를 사용한다.
// 정규표현식으로 해시태그를 추출하고 디비에 저장하고 게시글과 해시태그의 관계를 PostHashtag테이블에 넣습니다.
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async ( req, res, next ) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice( 1 ).toLowerCase() },
            })));
            await post.addHashtags( result.map( r => r[0] ) );
        }
        res.redirect( '/' );
    } catch(error){
        console.log( error );
        next( error );
    }
});

router.get('/hashtag', async ( req, res, next ) => {
    const query = req.query.hashtag;
    if( !query ){
        return res.redirect( '/' );
    }

    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if( hashtag ){
            // posts 정보를 가져올 때 user정보로 조인해서 가져온다.
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        });
    } catch (error) {
        console.error( error );
        return next( error );
    }
});

module.exports = router;