var fs = require("fs");
var crypto = require('crypto');
(function () {
    categoryInit = function (app) {
        // category list -get
        app.get('/category', function (req, res) {
            console.log("/category GET 请求");
            fs.readFile("./localdb/category.json", 'utf8', function (err, data) {
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
        // category add -post
        app.post('/category', function (req, res) {
            console.log("/category POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/category.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (req.body.name) {
                    if (data) {
                        data = JSON.parse(data);
                        var idx = data.findIndex(item => {
                            return req.body.name == item.name;
                        });
                        if (idx > -1) {
                            state = 1;
                            message = "名称不能重复";
                        } else {
                            data.push({
                                id: newId(),
                                name: req.body.name
                            });
                            data = JSON.stringify(data);
                            fs.writeFile('./localdb/category.json', data, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                        }
                    } else {
                        var data = [{
                            id: newId(),
                            name: req.body.name
                        }];
                        data = JSON.stringify(data);
                        var writerStream = fs.createWriteStream('./localdb/category.json');
                        writerStream.write(data, 'UTF8');
                        writerStream.end();
                    }
                } else {
                    state = 1;
                    message = "请正确填写名称";
                }
                res.send({
                    state: state,
                    data: null,
                    message: message
                });
            });
        })

        // category add -put
        app.put('/category/:id', function (req, res) {
            console.log("/category PUT 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/category.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (req.body.name) {
                    if (data) {
                        data = JSON.parse(data);
                        var idx = data.findIndex(item => {
                            return req.params.id == item.id;
                        });
                        if (idx > -1) {
                            data[idx].name = req.body.name;
                            data = JSON.stringify(data);
                            fs.writeFile('./localdb/category.json', data, function (err) {
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
                } else {
                    state = 1;
                    message = "请正确填写名称";
                }
                res.send({
                    state: state,
                    data: null,
                    message: message
                });
            });
        })
        // category add -delete
        app.delete('/category/:id', function (req, res) {
            console.log("/category DELETE 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/category.json", 'utf8', function (err, data) {
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
                        fs.writeFile('./localdb/category.json', data, function (err) {
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