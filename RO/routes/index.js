var price = require("../price");
var mailer = require("nodemailer");
var path = require("path");
var portfolioPath = 'public/img/portfolio';
var fs = require('fs');
/*
 * GET home page.
 */

exports.index = function (req, res) {
    var files = [];
    var albums = {}
    walkSync(portfolioPath, function (filePath, name) {
        if (!albums[filePath]) {
            albums[filePath] = []
        }
        var fullPath = path.join(filePath, name);
        albums[filePath].push({
            fullPath: fullPath,
            name: name
        })
    });
    
    for (var i in albums) {
        var album = albums[i];
        var descriptionPath = path.join(portfolioPath, path.dirname(album[0].fullPath), 'description.js')
        if (fs.existsSync(descriptionPath)) {
            var json = JSON.parse(fs.readFileSync(descriptionPath, 'utf8'));
            album.title = json.title;
            album.description = json.description;
        }
        files.push(album)
    }

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
        from: params.email,
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
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        if (path.extname(name) == '.js') return;
        var stat = fs.statSync(filePath);
        if (name == 'thumbnails') return;
        if (stat.isFile()) {
            callback(path.basename(currentDirPath), name);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}