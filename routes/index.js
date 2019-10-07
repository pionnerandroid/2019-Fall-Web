var express = require('express');
var router = express.Router();
let pool = require('../models/dbconnection')

/* GET home page. */
router.get('/', function(req, res, next) {

  sql = "SELECT * FROM board.board;"
  pool.getConnection((err, conn) => {
    if (err) return next(err)
    conn.query( sql, [], (err,docs) => {
      if(err) return next(err)
      var data = {
        "rows" : docs,
        "title" : "연습용 게시판"
      }
      console.log(data)
      conn.release() // DB를 다 썼으면 반납해야지?
      res.render('index', { title: data.title });
    })
  })
});

module.exports = router;