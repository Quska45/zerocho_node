const http = require( 'http' );
const fs = require( 'fs' );

http.createServer(( req, res ) => {
    // 문자 열도 가능 하지만 여기 처럼 버퍼를 보낼 수도 있다.
    fs.readFile('./server2.html', ( err, data ) => {
        if( err ){
            throw err;
        }
        res.end( data );
    });
}).listen(8081, () => {
    console.log( '8081포트에서 서버 대기중 입니다.' );
});