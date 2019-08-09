const express = require("express"),
    router = express.Router(),
    fs = require('fs');
//var data = fs.readFileSync('data.txt');

router.get('/',function(req,res){
    res.render('index')
}).post('/',function(req,res){
    // res.send(data1);
});
router.get('/single',function(req,res){
    res.render('single')
})
// // .post('/single',function(req,res){
// //     res.send({"code": 0,"msg": "","count": 1000,"data": [{"id": 10000, "username": "user-0", "sex": "女", "city": "城市-0", "sign": "签名-0"}]});
       
// // });
// router.get('/multi',function(req,res){
//     res.render('multi')
// });

module.exports = router;