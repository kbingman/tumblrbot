function withAjax() {

  // Takes an options argument with the standard XHR
  // attributes, but prepends the URL with the setting
  // base domain

  this.ajax = function(options) {

      var events = options.events;

      var xhr = $.extend(options.xhr, {
        context: this,
        url: options.xhr.url, //settings.api +
        dataType: 'json'
      });

      var request = $.ajax(xhr);

      for (var e in events) {
        request[e]($.proxy(function() {
          var args = [].slice.call(arguments);
          var event = args.shift();
          var response = args.shift();

          if (typeof event === 'string') {
            this.trigger(event, {
              response: response
            });
          } else if (typeof event === 'object') {
            this.trigger(event.node, event.event, {
              response: response
            });
          }
        }, this, events[e]));
      }

      return request;
  };
}

module.exports = withAjax;
