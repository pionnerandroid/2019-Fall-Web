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

router.get('/writeform', (req, res, next) => {
  res.render('writeform', { title: '연습장'})
})

router.post('/write', (req, res, next) => {
  let title = req.body.title
  let author = req.body.author
  let pw = req.body.pw
  let content = req.body.content

  arr = [title, author, pw, content]

  let sql = 'INSERT INTO board (title, author, regdate, pw, content, hit) VALUES (?,?,now(),?,?,0)'

  pool.getConnection((err, conn) =>{
    if (err) {
      return next(err)
    } else {
      conn.query(sql, arr, (err,row) =>{
        if(err){
          return next(err)
        } else {
          console.log('row = ', row)
          
          res.redirect('/')
        } conn.release()
      })
    }
  })
})

router.get('/deleteform/:id', (req,res) => {
  let id = req.params.id
  let data = {
    "id" : id,
    "title" : "게시글 삭제"
  }
  res.render('deleteform', data)
})

router.post('/delete',(req, res, next) => {

  let id = req.body.id
  let pw = req.body.pw
  
  pool.getConnection((err, conn) => { 
  if (err) return next(err)
  else{
    let sql = 'DELETE FROM board WHERE id=? AND pw=?'
    conn.query(sql, [id, pw], (err,row) =>{
      console.log('update row = ', row)
      if (row.affectedRows == 1)
        res.redirect('/')
      else
        res.send('<script> alert("비밀번호가 틀려서 되돌아 갑니다."); history.back(); </script>')
    })
  }})
})

module.exports = router;