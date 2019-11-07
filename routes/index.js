var express = require('express');
var router = express.Router();
let pool = require('../models/dbconnection')

/* GET home page. */
router.get('/', function(req, res, next) {

  sql = "SELECT `id`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2, `hit` FROM board.board;"
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
      res.render('index', data);
    })
  })
});

router.get('/read/:id', (req, res, next) => {
  let id = req.params.id
  
  pool.getConnection((err, conn) => {
    if(err) return next(err)
    sql = "SELECT `id`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2,`content`, `hit` FROM board.board WHERE id = ?;"

    conn.query(sql, [id], (err, row) => {
      if(err) return next(err)
      // console.log(row[0])
      let data = {
        "rows" : row[0],
        "title" : "게시판 읽기"
      }
      conn.release()
      res.render('read', data)
    })
  })
})

module.exports = router;