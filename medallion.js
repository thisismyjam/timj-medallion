// Setup

Jam = window.Jam || {};

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

Jam.Medallion.prototype.insertElement = function() {
  this.element = document.createElement('div')
  this.element.className = 'jam-medallion jam-loading';
  document.body.appendChild(this.element);
};

Jam.Medallion.prototype.fetch = function(element) {
  var callbackName = 'JamMedallionCallback_'+Math.floor(Math.random()*1000000),
      medallion    = this;

  window[callbackName] = function(json) {
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

Jam.Medallion.prototype.render = function(json) {
  this.element.className = this.element.className.replace(/\bjam-loading\b/, '');
  this.element.innerHTML = 'jam yo';
};

