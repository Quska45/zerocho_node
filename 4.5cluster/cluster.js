const cluster = require( 'cluster' );
const http = require( 'http' );
const numCPUs = require( 'os' ).cpus().length;

if( cluster.isMaster ){
    console.log( `마스터 프로세스 아이디: ${process.pid}` );
    //cpu개수만큼 워커를 생성. 마스터 프로세스가 cpu 수만큼 워커 프로세스를 만든다.
    //요청이 들어오면 만들어진 워커 프로세스에 요청을 분배한다.
    //워커는 실질적인 일을 하는 프로세스 이다.
    for( let i = 0; i < numCPUs; i += 1  ){
        cluster.fork();
    }
    //워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log( `${worker.process.pid}번 워커가 종료되었습니다.` );
        cluster.fork();
    });
} else {
    //워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.write( '<h1>Hello Node!</h1>' );
        res.end( '<p>Hellog Cluster!</p>' );
        
        //워커의 수만큼 프로세스가 종료되도 서버가 정상 작동한다.
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }).listen(8085);

    console.log( `${process.pid}번 워커 실행` );
}