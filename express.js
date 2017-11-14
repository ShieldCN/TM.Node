var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require("./route/category.js");
require("./route/user.js");
require("./route/memorandum.js");
require("./route/forMap.js");
require("./route/permission.js");

app.use(bodyParser.json());
//allow custom header and CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); /让options请求快速返回/
    }
    else {
        next();
    }
});
categoryInit(app);
userInit(app);
memorandumInit(app);
mapInit(app);
permissionInit(app);
var server = app.listen(2436, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

