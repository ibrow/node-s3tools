
var mysql = require('db-mysql');

/** @var BATCH_SIZE int Rows to process per tick **/
var BATCH_SIZE = 2;

var interval = null;
var i = 0;
new mysql.Database({
  hostname: 'localhost',
  user: 'root',
  password: '',
  database: 'jabbakam'
}).connect(function(error) {
  if (error) {
    return console.log("CONNECTION ERROR: " + error);
  }
  
  //interval = setInterval(get_rows, 2000, that);
  process_delete(this);
});

process_delete = function(that) {
  transaction_start(that, get_rows, error);
};

error = function(error) {
  return console.log('ERROR: ' + error);
}

/**
 * Get a list of BATCH_SIZE rows to process
 * @params that mysql database object
 **/
get_rows = function(that) {
  that.query().select('*').from('users').execute(function(error, rows) {
    if (error) {
      //transaction_rollback(that);
      return console.log('ERROR: ' + error);
    }
    console.log('START: '+rows.length + ' ROWS');
    transaction_commit(that);
    
/*
    i += 1;
    console.log("Interval = "+ interval);
    if(i > 5) {
      console.log("Clear Interval");
      clearInterval(interval);
    }
    */
  });
};

transaction_start = function(that, cb) {
  console.log("start transaction");
  that.query().execute('START TRANSACTION', function(error, success) {
    if (error) {
      return console.log('ERROR: ' + error);
    }
    console.log("Transaction started");

    cb(that);

  });
}

transaction_commit = function(that) {
  that.query().execute('COMMIT', function(error, rows) {
    if (error) {
      return console.log('ERROR: ' + error);
    }
    console.log("Transaction committed");
  });
}
transaction_rollback = function(that) {
  that.query().execute('ROLLBACK', function(error, rows) {
    if (error) {
      return console.log('ERROR: ' + error);
    }
    console.log("Transaction rolled back");
  });
}
