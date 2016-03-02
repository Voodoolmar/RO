var price = require("../price");
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'Ремонт и отделка'
    });
};

exports.price = function (req, res) {
    res.render('price', {
        title: 'Прайс',
        price: price.price
    });
};