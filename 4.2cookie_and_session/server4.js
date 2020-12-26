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

http.createServer(( req, res ) => {
    const cookies = parseCookie( req.headers.cookie );
    if( req.url.startsWith( '/login' ) ){
        //객체 중에서 키값이 query인 요서의 값을 담는다.
        const { query } = url.parse( req.url );
        const { name } = qs.parse( query );
        const expire = new Date();
        expire.setMinutes( expire.getMinutes() + 5 );
        res.writeHead(302, {
            Location: '/',
            //이렇게 쿠키를 사용하면 쿠키가 사용자에게 노출되기 때문에 좋지않다.
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expire.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    } else if(cookies.name){
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요.`)
    } else {
        fs.readFile('./server4.html', ( err, data ) => {
            if( err ){
                throw err;
            }
            res.end( data );
        })
    }
})
.listen(8083, ()=>{
    console.log("8083 포트 대기중");
})

module.exports = {
    parseCookie:parseCookie
}