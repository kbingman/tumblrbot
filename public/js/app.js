/**
 * Loads Flight components
 */
var flight = require('./lib/flight.js');
var templates = require('./templates.js');
var postData = require('./data/posts.js');
var searchUI = require('./component/search_ui.js');

var compose = flight.compose;
var registry = flight.registry;
var advice = flight.advice;
var withLogging = flight.logger;

window.templates = templates

// var defaultPage = require('./app/pages/default.js');
// var indexPage = require('./app/pages/index.js');
// var dashboardPage = require('./app/pages/dashboard.js');

compose.mixin(registry, [advice.withAdvice, withLogging]);

/**
 * Sets up the default components
 */
// defaultPage.init();

postData.attachTo(document);
searchUI.attachTo('[data-form="search"]');
