/**
 * Sector Data Component
 */

var defineComponent = require('../lib/flight.js').component;
var withAjax = require('../mixin/with_ajax.js');
var templates = require('../templates.js');

module.exports = defineComponent(postData, withAjax);

function postData() {
  this.attributes({
    searchButton: '[data-button="search"]',
    container: '[data-container="results"]',
    searchField: '[name="blog"]',
    tagField: '[name="tags"]',
    moreButton: '[data-button="more"]',
    imageDetailButton: '[data-button="detail"]',
    closeDetailButton: '[data-button="close"]',
    tagButton:'[data-button="tag"]',
    image: 'figure img',
    page: 0,
    images:[]
  });

  this.search = function(e){
    e.preventDefault();
    this.select('container')[0].innerHTML = '';
    this.attributes.page = 0;
    this.attributes.images = [];
    this.attributes.blog = this.select('searchField')[0].value;
    this.attributes.tag = this.select('tagField')[0].value;

    this.triggerSearch();
  };

  this.showTag = function(e){
    e.preventDefault();

    this.select('container')[0].innerHTML = '';
    this.attributes.page = 0;
    this.attributes.images = [];
    this.attributes.tag = e.target.innerHTML.toLowerCase().replace(/ /g,'+');

    this.triggerSearch();
  };

  this.showDetail = function(e){
    e.preventDefault();

    var src = e.target.href || e.target.parentNode.href;
    var image = this.attributes.images.filter(function(img, i){
      return img.url == src;
    })[0];
    var index = this.attributes.images.indexOf(image);
    var prev = this.attributes.images[index - 1]
    var next = this.attributes.images[index + 1]

    image.next = next ? next.url : null;
    image.prev = prev ? prev.url : null;

    this.select('container')[0].innerHTML = templates['_image'].render(image);
    this.attr.preloader = document.createElement('IMG');
    this.attr.preloader.src = image.url;

    this.swapImage();
  };

  this.swapImage = function() {
    var image = this.select('image');
    if (this.attr.preloader.complete) {
      console.log('complete');

      this.select('image')[0].src = this.attr.preloader.src;
    } else {
      setTimeout(this.swapImage.bind(this), 50);
    }
  }

  this.closeDetail = function(e){
    e.preventDefault();

    this.select('container')[0].innerHTML = templates['_images'].render({
      images: this.attributes.images
    });
  };

  this.showMore = function(e){
    e.preventDefault();
    ++this.attributes.page;

    this.triggerSearch();
  };

  this.triggerSearch = function(){
    var lastImage = this.attributes.images[this.attributes.images.length - 1];

    this.trigger('search', {
      blog: this.attributes.blog,
      tags: this.attributes.tag,
      page: this.attributes.page,
      timestamp: lastImage ? lastImage.timestamp : parseInt(+new Date() / 1000)
    });
  };

  this.setFields = function(e, data){
    this.select('searchField')[0].value = data.blog;
    this.select('tagField')[0].value = data.tags;
  };

  this.createElement = function(html) {
    var frag = new DocumentFragment(),
    temp = document.createElement('div');

    temp.innerHTML = html;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  };

  this.showResults = function(e, data){
    this.attributes.images = this.attributes.images.concat(data.images);

    var el = this.createElement(templates['_images'].render({
      images: data.images
    }));

    this.select('container')[0].appendChild(el);
  };

  this.delegateKeypress = function(e) {
    console.log(e.which);
  };

  this.after('initialize', function() {
    this.on(document, 'uiShowResults', this.showResults);
    this.on(document, 'search', this.setFields);

    this.on('click', {
      'searchButton': this.search,
      'moreButton': this.showMore,
      'imageDetailButton': this.showDetail,
      'closeDetailButton': this.closeDetail,
      'tagButton': this.showTag
    });

    this.on(document, 'keydown', this.delegateKeypress);
  });
}
