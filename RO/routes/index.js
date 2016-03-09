var price = require("../price");
var mailer = require("nodemailer");
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

exports.contactme = function (req, res) {
	var params = req.body;
    var smtpTransport = mailer.createTransport('smtps://info%40ro54.ru:beltyukov2009@smtp.yandex.ru');
    
    var mail = {
        from: "info@ro54.ru",
        to: "Beltyukov2008@mail.ru",
        subject: "Письмо с сайта",
        text: "Письмо с сайта",
        html: "<p>" +
	        "<h4>Как к вам обращаться</h4>" +
            params.name +
	        "</p>" +
            "<p>" +
	        "<h4>Телефон для связи</h4>" +
            params.phone +
	        "</p>" +
            "<p>" +
	        "<h4>Адрес помещения</h4>" +
            params.address +
	        "</p>" +
            "<p>" +
	        "<h4>Опишите виды требуемых работ</h4>" +
            params.message +
	        "</p>"
    }
    
    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        
        smtpTransport.close();
    });
    res.send('POST request to homepage');
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