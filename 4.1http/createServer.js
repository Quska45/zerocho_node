// http 서버가 있어야 웹 브라우저의 요청을 처리할 수 있다.
// http는 이벤트 리스너를 가진 노드의 서버이다.
const http = require( 'http' );

http.createServer(( req, res ) => {
    console.log("misson complete");
});