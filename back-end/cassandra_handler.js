const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'eleitor'
});

client.connect(function (err) {
  if (err) {
    console.log(err);
  };
  console.log('Cassandra loaded!')
});

// var query = 'INSERT INTO test_table (id, test_value) VALUES (?, ?)';
// var params = ['1', '123 testando'];
// client.execute(query, params, { prepare: true }, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Created user');
//   };
// });

// var query = 'SELECT * FROM politician_vote';
// client.execute(query, function (err, result) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Cassandra OK!');
//   };
// });

function handler(query, callback) {
  var wrapper = function(err, result){
    if (err) {return callback(err, result);}

    return callback(err, result['rows']);
  }

  client.execute(query, wrapper)
};

module.exports = {
  'handler': handler,
  'client': client
}
