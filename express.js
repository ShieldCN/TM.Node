var express = require('express');
var app = express();
var fs = require("fs");

//  主页输出 "Hello World"
app.get('/', function (req, res) {
    console.log("主页 GET 请求");
    res.send('Hello GET');
})


//  POST 请求
app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
})

// category list -get
app.get('/category', function (req, res) {
    console.log("/category GET 请求");
    fs.readFile(__dirname + "/" + "category.json", 'utf8', function (err, data) {
        if (data) {
            res.send({
                state: 0,
                data: JSON.stringify(data),
                message: 'success'
            });
        } else {
            res.send({
                state: 1,
                data: [],
                message: '不存在'
            });
        }
    });
})
// category add -post
app.post('/category', function (req, res) {
    console.log("/category POST 请求");
    // 读取已存在的数据
    fs.readFile(__dirname + "/" + "category.json", 'utf8', function (err, data) {
        console.log(req)
        if (data) {
            data = JSON.parse(data);
            
            console.log(data);
            res.end({
                state: 0,
                data: null,
                message: 'success'
            });
        } else {

        }
    });
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function (req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})
app.all('*', function(req, res, next) {
    req.header("Access-Control-Allow-Origin", '*');
})

var server = app.listen(2436, function () {

    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})