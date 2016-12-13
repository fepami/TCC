require('events').EventEmitter.prototype._maxListeners = 100;

const express = require("express");
const app = express();

const http = require('http');
const moment = require('moment');
moment.locale('pt-br');

const hostname = '127.0.0.1';
const port = 3000;

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const helpers = require("./helpers")

// const passport = require('passport');
// const Strategy = require('passport-facebook').Strategy;

const fs = require('fs');

// var config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
// var facebook_app_id = config['facebook_app_id'];
// var facebook_app_secret = config['facebook_app_secret'];
// var facebook_app_return_url = config['facebook_app_return_url'];

// passport.use(new Strategy({
//     'clientID': facebook_app_id,
//     'clientSecret': facebook_app_secret,
//     'callbackURL': facebook_app_return_url,
//     'profileFields': ['id', 'email', 'name'],
//   },
//   function(accessToken, refreshToken, profile, callback) {
//     // In this example, the user's Facebook profile is supplied as the user
//     // record.  In a production-quality application, the Facebook profile should
//     // be associated with a user record in the application's database, which
//     // allows for account linking and authentication with other identity
//     // providers.
//     facebook_user_id = profile.id;
//     facebook_user_email = profile.emails[0]['value'];
//     facebook_user_name = profile.name['givenName'] + ' ' + profile.name['familyName'];

//     var user_query = 'select id from user where ?? = ?';

// 		mysql_handler(user_query, ['facebook_id', facebook_user_id], function(err, user_by_fb){
// 			if (err) {return callback(err)}

// 			// achou o user com fb
// 			if (user_by_fb.length > 0) {
// 				user_by_fb = user_by_fb[0]
// 				user_info = {
// 					'id': user_by_fb['id'],
// 				}
// 				var token = helpers.create_token(user_info);

// 				return callback(null, token);
// 			}

// 			mysql_handler(user_query, ['email', facebook_user_email], function(err, user_by_email){
// 				if (err) {return callback(err)}

// 				// linkar a conta existente com o fb
// 				if (user_by_email.length > 0) {
// 					user_by_email = user_by_email[0]

// 					var update_user_query = 'update user set ? where id=?';
// 					var user_id = user_by_email['id']
// 					mysql_handler(update_user_query, [{'facebook_id': facebook_user_id}, user_id], function(err){
// 						if (err) {return callback(err)}

// 						user_info = {
// 							'id': user_id,
// 						}
// 						var token = helpers.create_token(user_info);

// 						return callback(null, token);
// 					});
// 				}

// 				// criar conta
// 				var create_user_query = 'insert into user set ?';
// 				mysql_handler(create_user_query, [{'facebook_id': facebook_user_id, 'email':facebook_user_email, 'name':facebook_user_name}], function(err, result){
// 					if (err) {return callback(err)}

// 					user_info = {
// 						'id': result.insertId,
// 					}
// 					var token = helpers.create_token(user_info);

// 					return callback(null, token);
// 				});
// 			});
// 		});
//   })
// );

// app.use(passport.initialize());


var politicians_controller = require("./politicians.js");
var proposals_controller = require("./proposals.js");
var user_controller = require("./user.js");
var filter_controller = require("./filter.js");

app.get("/",(req,res) => {
	if ('database' in req.query && 'execute_query' in req.query) {
		var query_handler = null;
		if (req.query['database'] == 'mysql') {
			query_handler = mysql_handler;
		}
		if (req.query['database'] == 'cassandra') {
			query_handler = cassandra_handler;
		}

		query_handler(req.query['execute_query'], function(err, result){
			if (err) {
				return res.json(err);
			}
			res.json(result);
		});
	}
});



app.get("/test_token", helpers.jwt_mw, function(req, res){
	var iat = req.user['iat'];
	var exp = req.user['exp'];

	var now = Math.floor(Date.now() / 1000);

	if ((exp-now)*2 < exp-iat) {
		res.status(419);
	}

	return res.json(req.user);

});
// /test_token?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNDc5Njg4MTk4LCJleHAiOjE0Nzk2OTE3OTh9.iu_qS6-QsJAX2kVeBx8Mx-QketCUly8lRy7wOb39bU0



const md5 = require("blueimp-md5")
const aws = require('aws-sdk');
const S3_BUCKET = 'eleitor';


var config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
var md5_key = config['md5_key']


aws.config.update({
  region: 'sa-east-1',
});

// s3-sa-east-1.amazonaws.com
// s3.dualstack.sa-east-1.amazonaws.com
// app.get('/sign-s3', (req, res, next) => {
//   const s3 = new aws.S3();
//   const file_name = req.query['file_name'];
//   const file_type = req.query['file_type'];
//   const s3Params = {
//     Bucket: S3_BUCKET,
//     Key: file_name,
//     Expires: 60,
//     ContentType: file_type,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return next(err);
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3-sa-east-1.amazonaws.com/${file_name}`
//     };
//     return res.json(returnData);
//   });
// });


app.get('/usuario/mudar_avatar', helpers.jwt_mw, (req, res, next) => {
  const s3 = new aws.S3();
  var user_id = req.user['id'];

	var user_code = md5(user_id, md5_key);
	var file_name = `${user_code}.jpg`;
  // var file_type = 'binary/octet-stream';
  var file_type = 'image/jpeg';
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: file_name,
    Expires: 60,
    ContentType: file_type,
    // ContentEncoding: 'base64',
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){return next(err);}

    var photo_url = `https://${S3_BUCKET}.s3-sa-east-1.amazonaws.com/${file_name}`
    const returnData = {
      signedRequest: data,
      url: photo_url
    };

    var update_user_query = 'update user set ? where id=?';

    mysql_handler(update_user_query, [{'photo_url': photo_url}, user_id], function(err, result){
      if (err) {return next(err);}

      return res.json(returnData);
    });
  });
});



app.get("/test_mail", function(req, res){
	var params = {
		to: "eleitor.app@gmail.com",
		subject: "test",
		text: "Yay, hello!!"
	}

	helpers.send_mail(params, function(err){
		if (err) {return res.json(err)}

		return res.json('ok');
	});
});

app.get("/usuario/esqueceu_senha", user_controller.forgot_password);





// app.get('/login/facebook', passport.authenticate('facebook', {'session': false, 'scope': 'email'}));
// app.get('/login/facebook/return', passport.authenticate('facebook', {'session': false, 'scope': 'email'}), function(req, res){
// 	res.json({'token': req.user});
// });

app.get("/login/cadastrar", user_controller.create_user);
// /login/cadastrar?name=Felipe&email=felipe@toyoda.com.br&password=bacon&state=SP&city=São Paulo&age=23&gender=Masculino

app.get("/login", user_controller.login);
// /login?email=felipe@toyoda.com.br&password=bacon&profile_id=afafkanjkbasjinjkasn

app.get("/usuario/editar", helpers.jwt_mw, user_controller.update_user);
// /usuario/editar?name=Felipe&state=SP&city=São Paulo&age=23&gender=Masculino&token=asfsdfsdfs

app.get("/usuario/trocar", helpers.jwt_mw, user_controller.update_password);
// /usuario/trocar?antigo=senhaAntiga&novo=senhaNova&token=asfsdfsdfs

app.get("/politicos", helpers.jwt_mw, politicians_controller.get_politicians);
app.get("/politicos/ranking", helpers.jwt_mw, politicians_controller.get_ranking);
app.get("/politicos/eleicoes", helpers.jwt_mw, politicians_controller.get_election);
app.get("/politicos/busca", helpers.jwt_mw, politicians_controller.filtered_by_special_filter);


app.get("/politicos/:politician_id",helpers.jwt_mw, politicians_controller.get_politician);
app.get("/politicos_seguidos",helpers.jwt_mw, politicians_controller.get_followed); // /politicos/seguidos?device_id=device_id1

app.get("/politicos/:politician_id/propostas",helpers.jwt_mw, proposals_controller.get_politician_proposals);

app.get("/politicos/:politician_id/votar",helpers.jwt_mw, politicians_controller.vote);
app.get("/politicos/:politician_id/seguir",helpers.jwt_mw, politicians_controller.follow);

app.get("/politicos/:politician_id/carreira", politicians_controller.history);



app.get("/filtro/politicos", filter_controller.get_politician_filter);
app.get("/filtro/propostas", filter_controller.get_proposal_filter);




app.get("/propostas",helpers.jwt_mw, proposals_controller.get_proposals);
app.get("/propostas/ranking",helpers.jwt_mw, proposals_controller.get_ranking);
app.get("/propostas/busca", helpers.jwt_mw, proposals_controller.filtered_by_special_filter);

app.get("/propostas/:proposal_id",helpers.jwt_mw, proposals_controller.get_proposal);
app.get("/propostas/:proposal_id/votar",helpers.jwt_mw, proposals_controller.vote);

var cmd_args = process.argv.slice(2);
if (cmd_args.indexOf('live') != -1) {
	const https = require('https');
	const https_options = {
	  key: fs.readFileSync('config/key.pem'),
	  cert: fs.readFileSync('config/cert.pem')
	};
	https.createServer(https_options, app).listen(443);
}
http.createServer(app).listen(port);
