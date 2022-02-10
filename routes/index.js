const express = require('express');
const router = express.Router();

router.get("/games/pt_legacy",(req,res)=>{
  res.render("/games/pt_legacy/index");
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
