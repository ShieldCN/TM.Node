var fs = require("fs");
var crypto = require('crypto');
(function () {
    // login -post
    userInit = function (app) {
        app.post('/login', function (req, res) {
            console.log("/user POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/user.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                var rdata=null;
                if (req.body.username && req.body.password) {
                    if (data) {
                        data = JSON.parse(data);
                        var idx = data.findIndex(item => {
                            return req.body.username == item.username;
                        });
                        if (idx > -1 && req.body.password == data[idx].password) {
                            message = "登录成功";
                            rdata={
                                token:data[idx].id
                            }
                        } else {
                            state = 1;
                            message = "用户名或密码错误";
                        }
                    } else {
                        state = 1;
                        message = "用户名或密码错误";
                    }
                } else {
                    state = 1;
                    message = "请正确填写用户名或密码";
                }
                res.send({
                    state: state,
                    data: rdata,
                    message: message
                });
            });
        })
        // user list -get
        app.get('/user', function (req, res) {
            console.log("/user GET 请求");
            fs.readFile("./localdb/user.json", 'utf8', function (err, data) {
                if (data) {
                    data = JSON.parse(data);
                    res.send({
                        state: 0,
                        data: data,
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
        // user add -post
        app.post('/user', function (req, res) {
            console.log("/user POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/user.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.body.username == item.username;
                    });
                    if (idx > -1) {
                        state = 1;
                        message = "用户名不能重复";
                    } else {
                        let mdId=newId();
                        data.push({
                            id: mdId,
                            username: req.body.username,
                            password: req.body.password
                        });
                        data = JSON.stringify(data);
                        fs.writeFile('./localdb/user.json', data, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        fs.mkdir("./localdb/"+mdId,function(err){
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                } else {
                    var data = [{
                        id: newId(),
                        username: req.body.username,
                        password: req.body.password
                    }];
                    data = JSON.stringify(data);
                    var writerStream = fs.createWriteStream('./localdb/user.json');
                    writerStream.write(data, 'UTF8');
                    writerStream.end();
                }
                res.send({
                    state: state,
                    data: null,
                    message: message
                });
            });
        })
        // user add -put
        app.put('/user/:id', function (req, res) {
            console.log("/user PUT 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/user.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.params.id == item.id;
                    });
                    if (idx > -1) {
                        data[idx].username = req.body.username;
                        data[idx].password = req.body.password;
                        data = JSON.stringify(data);
                        fs.writeFile('./localdb/user.json', data, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    } else {
                        state = 1;
                        message = "数据已删除";
                    }
                } else {
                    state = 1;
                    message = "数据已删除";
                }
                res.send({
                    state: state,
                    data: null,
                    message: message
                });
            });
        })
        // user add -delete
        app.delete('/user/:id', function (req, res) {
            console.log("/user DELETE 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/user.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.params.id == item.id;
                    });
                    if (idx > -1) {
                        data.splice(idx, 1);
                        data = JSON.stringify(data);
                        fs.writeFile('./localdb/user.json', data, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        fs.rmdir("./localdb/"+req.params.id,function(err){
                            if (err) {
                                return console.error(err);
                            }
                        });
                    } else {
                        state = 1;
                        message = "数据已删除";
                    }
                } else {
                    state = 1;
                    message = "数据已删除";
                }
                res.send({
                    state: state,
                    data: null,
                    message: message
                });
            });
        })
    }

})();

function newId() {
    var date = new Date();
    date = date.getTime();
    return md5(date + "")
}
function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
};