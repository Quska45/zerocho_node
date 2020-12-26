const http = require( 'http' );
const fs = require( 'fs' );
const url = require( 'url' );
const qs = require( 'querystring' );

const parseCookie = ( cookie = '' ) => 
    cookie
    .split(';')
    .map( v => v.split( '=' ) )
    .map( ( ( [ k, ...vs ] ) => [ k, vs.join( '=' ) ] ) )
    .reduce(( acc, [ k, v ] ) => {
        acc[ k.trim() ] = decodeURIComponent( v );
        return acc;
    }, {});

//이런 방식이 세션이다. 서버에 사용자 정보를 저장하고 클라이언트와 세션 아이디로만 소통한다.
//이건 예시기 때문에 보안이 매우 취약하다. 앞으로 차근차근 알아보자.
const session = {};

http.createServer(( req, res ) => {
    const cookies = parseCookie( req.headers.cookie );
    if( req.url.startsWith( '/login' ) ){
        //객체 중에서 키값이 query인 요서의 값을 담는다.
        const { query } = url.parse( req.url );
        const { name } = qs.parse( query );
        const expire = new Date();
        expire.setMinutes( expire.getMinutes() + 5 );

        const randomInt = Date.now();
        session[randomInt] = {
            name,
            expire,
        }

        res.writeHead(302, {
            Location: '/',
            //이런게 세션의 방식인 것이다.
            'Set-Cookie': `session=${randomInt}; Expires=${expire.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    } else if(cookies.session && session[cookies.session].expire > new Date()){
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`${session[cookies.session].name}님 안녕하세요.`)
    } else {
        fs.readFile('./server4.html', ( err, data ) => {
            if( err ){
                throw err;
            }
            res.end( data );
        })
    }
})
.listen(8084, ()=>{
    console.log("8084 포트 대기중");
})

module.exports = {
    parseCookie:parseCookie
}