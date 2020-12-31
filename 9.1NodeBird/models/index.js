const Sequelize = require( 'sequelize' );
const env = process.env.NODE_ENV || 'development';
const config = require( '../config/config' )[env];
const db = {};

let sequelize = new Sequelize( config.database, config.username, config.password, config );

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require( './user' )( sequelize, Sequelize );
db.Post = require( './post' )( sequelize, Sequelize );
db.Hashtag = require( './hashtag' )( sequelize, Sequelize );
db.User.hasMany( db.Post );
db.Post.belongsTo( db.User ); // hasMany와 belongsTo로 연결되어 Post에 userId가 추가된다. 1:N
// N:M 관계 표현
db.Post.belongsToMany( db.Hashtag, { through: 'PostHashtag' } );
db.Hashtag.belongsToMany( db.Post, { through: 'PostHashtag' } );
// 같은 테이블도 N:M관계를 가질 수 있다.
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers', // as 옵션은 join작업시 사용하는 이름. as에 등록한 이름을 바탕으로 메서드를 자동으로 추가한다.
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});
module.exports = db;
// 모델은 총 5개가 생성된다.
