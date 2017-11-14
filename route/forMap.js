var fs = require("fs");
var crypto = require('crypto');
(function () {
    mapInit = function (app) {
        // map list -get
        app.get('/map/query', function (req, res) {
            console.log("/map GET 请求");
            fs.readFile("./localdb/map.json", 'utf8', function (err, data) {
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
        // map add -post
        app.post('/map', function (req, res) {
            console.log("/map POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/map.json", 'utf8', function (err, data) {
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
                            fs.writeFile('./localdb/map.json', data, function (err) {
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
                        var writerStream = fs.createWriteStream('./localdb/map.json');
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

        // map edit -put
        app.put('/map/:id', function (req, res) {
            console.log("/map PUT 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/map.json", 'utf8', function (err, data) {
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
                            fs.writeFile('./localdb/map.json', data, function (err) {
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
        // map delete -delete
        app.delete('/map/:id', function (req, res) {
            console.log("/map DELETE 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/map.json", 'utf8', function (err, data) {
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
                        fs.writeFile('./localdb/map.json', data, function (err) {
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