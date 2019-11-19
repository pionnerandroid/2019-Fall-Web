var express = require('express');
var router = express.Router();
var pool = require('../models/dbconnection')

/* GET home page. */
router.get('/', function (req, res, next) {
  var sql = "SELECT `id`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2, `hit` FROM board.board;";
  pool.getConnection((err, conn) => {
    if (err) return next(err)
    conn.query(sql, [], (err, docs) => {
      if (err) return next(err)
      console.log(docs)
      var data = {
        "rows": docs,
        "title": "연습용 게시판"

      }
      conn.release() // DB 다 쓰면 반납
      res.render('index', data);
    })
  })
});

router.get('/writeform', (req, res, next) => {
  res.render('writeform', { title: '연습장' })
})

router.post('/write', (req, res, next) => {
  // 받아서 insert 후에 list로 돌아간다.
  var title = req.body.title
  var author = req.body.author
  var pw = req.body.pw
  var content = req.body.content
  // console.log("제목 :", title)
  // console.log("글쓴이 :", author)
  // console.log("비밀번호 :", pw)
  // console.log("내용 :", content)

  //board 테이블에 insert하기

  var sql = 'INSERT INTO board(title, author, regdate, pw, content, hit) VALUES (?,?,now(),?,?,0)'
  var arr = [title, author, pw, content]
  // console.log(arr)
  pool.getConnection((err, conn) => {
    if (err) {
      return next(err)
    }
    else {
      conn.query(sql, arr, (err, row) => {
        if (err) {
          return next(err)
        }
        else {
          console.log('row =', row)

          res.redirect('/')
        } conn.release()
      })
    }
  })

})

router.get('/read/:no', (req, res, next) => {
  var no = req.params.no
  // console.log("입력한 숫자는?? == ",no)

  pool.getConnection((err, conn) => {
    if (err) return next(err)
    sql = "SELECT `no`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2, `content`, `hit` FROM board.board WHERE no = ?;"

    conn.query("UPDATE board SET `hit` = `hit` + 1 WHERE `no` = ?", [no], (err, doc) => {
      if (err) {
        return next(err);
      }
      conn.query(sql, [no], (err, row) => {
        if (err) return next(err)
        console.log(row[0])
        var data = {
          "rows": row[0],
          "title": "게시판 읽기"
        }
        conn.release() // DB 다 쓰면 반납
        res.render('read', data)
      });
    })
  })
})

router.get('/updateform/:no', (req, res, next) => {
  var no = req.params.no
  // console.log("입력한 숫자는?? == ",no)

  pool.getConnection((err, conn) => {
    if (err) return next(err)
    sql = "SELECT `no`, `title`, `author`, DATE_FORMAT(regdate, '%Y\/%c\/%e') AS regdate2, `content`, `hit`,`pw` FROM board.board WHERE no = ?;";

    conn.query(sql, [no], (err, row) => {
      if (err) {
        return next(err)
      }
      else {
        console.log("updateform", row[0])
        var data = {
          "rows": row[0],
          "title": "게시판 읽기"
        }
      }
      conn.release() // DB 다 쓰면 반납
      res.render('updateform', data)
    });
  })
})

router.post('/update', (req, res, err) => {

  var no = req.body.no
  var title = req.body.title
  var author = req.body.author
  var pw = req.body.pw
  var content = req.body.content

  // console.log("제목 :", title)
  // console.log("글쓴이 :", author)
  // console.log("비밀번호 :", pw)
  // console.log("내용 :", content)

  //board 테이블에 insert하기

  var sql = "UPDATE board SET `title` =?, `author` =?, `content` =?, `regdate`=now() WHERE `no` =? AND `pw` =?";
  var arr = [title, author, content, no, pw];
  // console.log(arr)
  pool.getConnection((err, conn) => {
    if (err) {
      return next(err)
    }
    else {
      conn.query(sql, arr, (err, row) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        else {
          console.log('row =', row);
          if(row.affectedRows == 1) {
            res.redirect('/')
          } else {
            res.send("<script>alert('비밀번호가 틀려서 되돌아 갑니다.'); hitory.back(); </script>")
          }
          conn.release();
        } 
      })
    }
  })

})

router.get('/deleteform/:no', (req, res) => {
  var no = req.params.no
  console.log("no = ", no)
  var data = {
    "no" : no,
    "title" : "게시글 삭제"
  }
  res.render('deleteform' , data)
})

router.post('/delete', (req,res, next) => {
  console.log("delete req body", req.body)
  var no = req.body.no
  var pw = req.body.pw
  
  pool.getConnection((err, conn) => {
    if(err) { return next(err) }
    var sql = 'DELETE FROM board WHERE no=? AND pw=?'
    conn.query(sql, [no, pw], (err, row) => {
      console.log('update row =', row)
      if (row.affectedRows == 1){
        res.redirect('/')
      } else {
        res.send('<script> alert("비밀번호가 틀려서 되돌아 갑니다."); history.back(); </script>') 
      }
    })
  })
})

module.exports = router;