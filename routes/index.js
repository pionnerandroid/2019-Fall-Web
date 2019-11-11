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

router.get('/updateform/:id', (req, res, next) => {
  let id = req.params.id

  pool.getConnection((err, conn) => {
    if(err) return next(err)
    sql = "SELECT `id`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2,`content`, `hit` FROM board.board WHERE id = ?;"

    conn.query(sql, [id], (err, row) => {
      if(err) return next(err)
      
      let data = {
        "rows" : row[0],
        "title" : "게시판 읽기"
      }
      conn.release()
      res.render('updateform', data)
    })
  })
  
})

router.post('/update', (req,res,next) => {
  
  let id = req.body.id
  let title = req.body.title
  let author = req.body.author
  let pw = req.body.pw
  let content = req.body.content

  pool.getConnection((err, conn) => {
    let sql = "UPDATE board SET `title` = ?, `author`=?, `content`=?, `regdate`=now() WHERE `id`=? AND `pw`=?"
    let arr = [title, author, content, id, pw]

    if(err) return next(err)
    else {
      conn.query(sql, arr, (err,row) => {
        if(err) return next(err)
        else {
          if(row.affectedRows == 1) res.redirect('/')
          else res.send("<script>alert('비밀번호가 틀려서 되돌아 갑니다.'); history.back(); </script>")
        }
        conn.release()
      })
    }

    
  })

})

module.exports = router;