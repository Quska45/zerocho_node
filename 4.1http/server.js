const http = require( 'http' );

// 서버에서 응답을 보내는 부분과 서버 연결 부분을 추가햤다.
http.createServer(( req, res ) => {
    // 1. 응답을 보냈다.
    res.write( '<h1>Hello Node!</h1>' );
    res.end( '<p>Hello Server!</p>' );
})
// 서버 연결 부분을 추가했다. 이제 서버는 요청에 대해 응답을 보낼 준비를 했고 요청이 오면 정해진 값을 응답한다.
.listen( 8080, () => {
    console.log( '8080번 포트에서 서버 대기 중입니다.' );
} );