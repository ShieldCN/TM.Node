var fs = require("fs");
var crypto = require('crypto');
(function () {
    permissionInit = function (app) {
        // permission list -get
        app.get('/permission', function (req, res) {
            console.log("/permission GET 请求");
            fs.readFile("./localdb/permission.json", 'utf8', function (err, data) {
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
        // permission add -post
        app.post('/permission', function (req, res) {
            console.log("/permission POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/permission.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.body.name == item.name||req.body.state == item.state;
                    });
                    if (idx > -1) {
                        state = 1;
                        message = "权限名称或state重复！";
                    } else {
                        let mdId=newId();
                        data.push({
                            id: mdId,
                            name: req.body.name,
                            state: req.body.state
                        });
                        data = JSON.stringify(data);
                        fs.writeFile('./localdb/permission.json', data, function (err) {
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
                        name: req.body.name,
                        state: req.body.state
                    }];
                    data = JSON.stringify(data);
                    var writerStream = fs.createWriteStream('./localdb/permission.json');
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
        // permission edit -put
        app.put('/permission/:id', function (req, res) {
            console.log("/permission PUT 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/permission.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.params.id == item.id;
                    });
                    if (idx > -1) {
                        data[idx].name = req.body.name;
                        data[idx].state = req.body.state;
                        data = JSON.stringify(data);
                        fs.writeFile('./localdb/permission.json', data, function (err) {
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
        // permission add -delete
        app.delete('/permission/:id', function (req, res) {
            console.log("/permission DELETE 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/permission.json", 'utf8', function (err, data) {
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
                        fs.writeFile('./localdb/permission.json', data, function (err) {
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