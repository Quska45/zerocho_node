const http = require( 'http' );

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
    const cookie = parseCookie( req.headers.cookie );
    console.log( req.url, cookie );
    // 첫번 째 인자는 응답코드, 두번째는 헤더의 내용
    res.writeHead( 200, { 'Set-Cookie': 'mycookie=test' } );
    res.end( 'Hello Cookie' );
}).listen( 8082, () => {
    console.log( '8082번 포트에서 서버 대기 중이다.' );
} )