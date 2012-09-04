// Setup + utilities

Jam = window.Jam || {};

Jam.escapeHTML = function(text) {
  var tmpEl = document.createElement('div');
  ("innerText" in tmpEl) ? (tmpEl.innerText=text) : (tmpEl.textContent=text);
  return tmpEl.innerHTML;
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

// Instance methods

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

Jam.Medallion.prototype.insertElement = function() {
  this.element = document.createElement('div')
  this.element.className = 'jam-medallion jam-loading';
  document.body.appendChild(this.element);
};

Jam.Medallion.prototype.fetch = function(element) {
  var callbackName = 'JamMedallionCallback_'+Math.floor(Math.random()*1000000),
      medallion    = this;

  window[callbackName] = function(json) {
    medallion.setJSON(json);
    medallion.render(json);
  };

  document.write(
    '<script src="http://api.thisismyjam.com/1/' +
    this.username +
    '.json?callback=' +
    callbackName +
    '"></script>'
  );
};

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
  var imageElement = document.createElement('img');
  imageElement.className = 'jam-jamvatar';
  imageElement.src = this.json.jam.jamvatarSmall;
  return imageElement;
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
  var linkElement = this.createLinkElement();
  linkElement.innerHTML = Jam.escapeHTML('Follow me on This Is My Jam');
  return linkElement;
};

Jam.Medallion.prototype.createLinkElement = function() {
  var linkElement = document.createElement('a');
  linkElement.href = 'http://www.thisismyjam.com/'+this.username;
  return linkElement;
};
