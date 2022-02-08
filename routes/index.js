const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(_req, res) {
  res.render('index');
});

router.get("/games/demo6",(req,res)=>{
  res.render("/games/demo6/index");
});
router.get("/games/demo8",(req,res)=>{
  res.render("/games/demo8/index");
});
router.get("/games/2048",(req,res)=>{
  res.render("/games/2048/index");
});
router.get("/games/painotiles",(req,res)=>{
  res.render("/games/painotiles/index");
});


module.exports = router;
