/*
 * Renders a link to a This Is My Jam user's profile, with an image, text or both.
 * If the user has no active jam, renders a simple 'follow me' link.
 *
 * Usage
 * -----
 *
 *     <script src="http://www.thisismyjam.com/medallion.js"></script>
 *     <script>Jam.Medallion.insert({username: "..."})</script>
 *
 * You can pass several options to Jam.Medallion.insert:
 *
 * - text: Set to false to stop showing the 'My current jam is:' tag.
 * - image: Set to false to stop showing the jam avatar.
 * - imageSize: "small" (default), "medium" or "large".
 */

// Setup + utilities

Jam = window.Jam || {};

Jam.escapeHTML = function(text) {
  var tmpEl = document.createElement('div');
  ("innerText" in tmpEl) ? (tmpEl.innerText=text) : (tmpEl.textContent=text);
  return tmpEl.innerHTML;
}

Jam.getJSONP = function (url, callback) {
  var callbackName = '_'+Math.floor(Math.random()*1000000);

  Jam.callbacks = Jam.callbacks || {};
  Jam.callbacks[callbackName] = callback;

  var script = document.createElement('script');
  script.src = url + window.encodeURIComponent('Jam.callbacks.' + callbackName);
  document.getElementsByTagName('head')[0].appendChild(script);
}

// Constructor

Jam.Medallion = function(options) {
  this.setOptions(options);
};

// Class methods

Jam.Medallion.insert = function(options) {
  var medallion = new Jam.Medallion(options);
  medallion.insertElement();
  medallion.fetch();
}

// Accessors

Jam.Medallion.prototype.setOptions = function(options) {
  this.options  = options;
  this.username = options.username;
};

Jam.Medallion.prototype.getOption = function(name, defaultValue) {
  if (this.options.hasOwnProperty(name)) {
    return this.options[name];
  } else {
    return defaultValue;
  }
};

Jam.Medallion.prototype.setJSON = function(json) {
  this.json = json;
};

// Initialization

Jam.Medallion.prototype.insertElement = function() {
  this.element = document.createElement('div')
  this.element.className = 'jam-medallion jam-loading';
  document.body.appendChild(this.element);
};

Jam.Medallion.prototype.fetch = function(element) {
  var medallion = this;

  Jam.getJSONP(
    'http://api.thisismyjam.com/1/' + this.username + '.json?callback=',

    function(json) {
      medallion.setJSON(json);
      medallion.render();
    }
  );
};

// Rendering

Jam.Medallion.prototype.render = function() {
  this.element.className = this.element.className.replace(/\bjam-loading\b/, '');

  if (this.json.hasOwnProperty('jam')) {
    if (this.getOption('image', true)) {
      this.element.appendChild(this.createImageElement());
    }

    if (this.getOption('text', true)) {
      this.element.appendChild(this.createTextElement());
    }
  } else {
    this.element.className += 'jam-inactive';
    this.element.appendChild(this.createNoJamTextElement());
  }
};

Jam.Medallion.prototype.createImageElement = function() {
  var imageSize = this.getOption('imageSize', 'small');
  var imageKey  = 'jamvatar' + imageSize[0].toUpperCase() + imageSize.substring(1);

  var imageElement = document.createElement('img');
  imageElement.className = 'jam-jamvatar';
  imageElement.src = this.json.jam[imageKey];

  var linkElement = this.createLinkElement();
  linkElement.className = 'jam-image';
  linkElement.appendChild(imageElement);

  return linkElement;
};

Jam.Medallion.prototype.createTextElement = function() {
  var textElement = document.createElement('p');
  textElement.className = 'jam-text';
  textElement.innerHTML = Jam.escapeHTML('My current jam is ');

  var linkElement = this.createLinkElement();
  linkElement.innerHTML += '&ldquo;' + Jam.escapeHTML(this.json.jam.title) + '&rdquo;';
  linkElement.innerHTML += Jam.escapeHTML(' by ' + this.json.jam.artist);
  textElement.appendChild(linkElement);

  textElement.innerHTML += Jam.escapeHTML('.');

  return textElement;
};

Jam.Medallion.prototype.createNoJamTextElement = function() {
  var textElement = document.createElement('p');
  textElement.className = 'jam-text';

  var linkElement = this.createLinkElement();
  linkElement.innerHTML = Jam.escapeHTML('Follow me on This Is My Jam');
  textElement.appendChild(linkElement);

  return textElement;
};

Jam.Medallion.prototype.createLinkElement = function() {
  var linkElement = document.createElement('a');
  linkElement.href = 'http://www.thisismyjam.com/'+this.username;
  return linkElement;
};
