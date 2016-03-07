var price = require("../price");
/*
 * GET home page.
 */

exports.index = function (req, res) {
	var files = [];
    walkSync('public/img/portfolio/thumbnails', function (filePath, stat) {
	    files.push(filePath);
    });

    res.render('index', {
        title: 'Ремонт и отделка',
        files: files
    });
};

exports.price = function (req, res) {
    res.render('price', {
        title: 'Прайс',
        price: price.price
    });
};

function walkSync(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(path.basename(filePath), stat);
        } else if (stat.isDirectory()) {
            walkSync(path.basename(filePath), callback);
        }
    });
}