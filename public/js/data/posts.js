/**
 * Sector Data Component
 */

var defineComponent = require('../lib/flight.js').component;
var withAjax = require('../mixin/with_ajax.js');

module.exports = defineComponent(postData, withAjax);

function postData() {
  this.attributes({
    images: []
  });

  this.parseResponse = function(e, data){
    var posts = data.response.posts || data.response;

    console.log(data)

    // if (!data.response || !data.response.posts){
    //   // alert('error goes here')
    //   this.trigger('ajaxError');
    //   return;
    // }

    var images = posts.reduce(function(memo, post){
      if (!post.photos) {
        return memo;
      }
      post.photos.forEach(function(photo) {
        var url = photo.original_size.url;
        var regex = new RegExp('_1280');
        if (!regex.test(url)){
          return;
        }

        memo.push({
          url: photo.original_size.url,
          src: photo.alt_sizes.reduce(function(memo, p) {
            if (p.width == 250) {
              memo = p.url;
            }
            return memo;
          }, undefined),
          caption: post.caption,
          source: post.source_title,
          timestamp: post.timestamp,
          tags: post.tags
        });
      });
      return memo;
    }, []);
    this.trigger('uiShowResults', { images: images });
  };

  this.getPosts = function(e, data){
    // var date = data.timestamp ? +new Date(data.timestamp) : +new Date();

    console.log(data);

    this.ajax({
      xhr: {
        url: '/search/',
        data: {
          blog: data.blog,
          offset: data.page * 20,
          tags: data.tags,
          before: data.timestamp
        }
      },
      events: {
        done: 'ajaxBlogResponse',
        fail: 'ajaxError'
      }
    });
  };

  this.after('initialize', function() {
    window.data = this;
    this.on(document, 'search', this.getPosts);
    this.on(document, 'ajaxBlogResponse', this.parseResponse);
  });
}
