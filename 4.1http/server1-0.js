const http = require( 'http' );

const server = http.createServer(( req, res ) => {
    res.write( '<h1>Hello Node!</h1>' );
    // end는 응답을 종료하는 메서드 이다.
    res.end( '<p>Hello Server!</p>' );
});

server.listen( 8080 );

server.on( 'listening', () => {
    console.log( '8080포트에서 서버 대기중 입니다.' );
} )

server.on( 'error', (error) => {
    console.log( error );
} )