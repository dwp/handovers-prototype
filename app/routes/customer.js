/**
 * Created by janegleadall on 24/08/2017.
 */
var customer = require("../controllers/customerController.js");

module.exports = function(router) {

    // Customers page routes
    router.get('/customer/summary', customer.customerSummaryPage);
    router.get('/customer/view', customer.customerViewPage);
    router.get('/customer/find', customer.customerFindPage);
    router.post('/customer/find', customer.customerFindPageAction);
    router.get('/customer/create', customer.customerCreatePage);
    router.post('/customer/create', customer.customerCreatePageAction);
    router.get('/customer/edit', customer.customerEditPage);
    router.post('/customer/edit', customer.customerEditPageAction);
}