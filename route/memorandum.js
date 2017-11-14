var fs = require("fs");
var crypto = require('crypto');
(function () {
    memorandumInit = function (app) {
        // memorandum list -get
        app.get('/memorandum', function (req, res) {
            console.log("/memorandum GET 请求");
            fs.readFile("./localdb/"+req.headers.authorization+"/memorandum.json", 'utf8', function (err, data) {
                if (data) {
                    data = JSON.parse(data);
                    fs.readFile("./localdb/"+req.headers.authorization+"/category.json", 'utf8', function (err, cdata) {
                        if (cdata) {
                            cdata = JSON.parse(cdata);
                            let params=req.query;
                            var resData=[];
                            data.forEach(function(item) {
                                let canPush=true;
                                if(params.name&&item.name.indexOf(params.name)==-1){
                                    canPush=false;
                                }
                                if(params.category&&item.category!=params.category){
                                    canPush=false;
                                }
                                if(canPush){
                                    let categoryd=cdata.find(it=>{
                                        return it.id==item.category;
                                    });
                                    item.categoryText=categoryd?categoryd.name:"";       
                                    resData.push(item);  
                                }
                            }, this);
                            res.send({
                                state: 0,
                                data: resData,
                                message: 'success'
                            });
                        }
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
        // memorandum add -post
        app.post('/memorandum', function (req, res) {
            console.log("/memorandum POST 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/"+req.headers.authorization+"/memorandum.json", 'utf8', function (err, data) {
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
                            data.unshift({
                                id: newId(),
                                name: req.body.name,
                                category: req.body.category,
                                functionDesc: req.body.functionDesc,
                                details: req.body.details,
                                tabs: req.body.tabs
                            });
                            data = JSON.stringify(data);
                            fs.writeFile('./localdb/'+req.headers.authorization+'/memorandum.json', data, function (err) {
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
                        var writerStream = fs.createWriteStream('./localdb/'+req.headers.authorization+'/memorandum.json');
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

        // memorandum edit -put
        app.put('/memorandum/:id', function (req, res) {
            console.log("/memorandum PUT 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/"+req.headers.authorization+"/memorandum.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                if (req.body.name) {
                    if (data) {
                        data = JSON.parse(data);
                        var idx = data.findIndex(item => {
                            return req.params.id == item.id;
                        });
                        if (idx > -1) {
                            data[idx]={
                                id:req.params.id,
                                name: req.body.name,
                                category: req.body.category,
                                functionDesc: req.body.functionDesc,
                                details: req.body.details,
                                tabs: req.body.tabs
                            }
                            data = JSON.stringify(data);
                            fs.writeFile('./localdb/'+req.headers.authorization+'/memorandum.json', data, function (err) {
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
        // memorandum delete -delete
        app.delete('/memorandum/:id', function (req, res) {
            console.log("/memorandum DELETE 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/"+req.headers.authorization+"/memorandum.json", 'utf8', function (err, data) {
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
                        fs.writeFile('./localdb/'+req.headers.authorization+'/memorandum.json', data, function (err) {
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
        });
        // memorandum delete -delete
        app.get('/memorandum/:id', function (req, res) {
            console.log("/memorandum/:id GET 请求");
            // 读取已存在的数据
            fs.readFile("./localdb/"+req.headers.authorization+"/memorandum.json", 'utf8', function (err, data) {
                var message = "success";
                var state = 0;
                var resData=null;
                if (data) {
                    data = JSON.parse(data);
                    var idx = data.findIndex(item => {
                        return req.params.id == item.id;
                    });
                    if (idx > -1) {
                        resData=data[idx];
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
                    data: resData,
                    message: message
                });
            });
        });
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