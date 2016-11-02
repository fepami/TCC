const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['172.17.0.2', '172.17.0.1'],
  keyspace: 'test_keyspace'
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

var query = 'SELECT * FROM test_table';
client.execute(query, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log('Cassandra OK!');
  };
});

function handler(query, callback) {
  client.execute(query, callback)
};

module.exports = {
  'handler': client.execute,
  'client': client
}
