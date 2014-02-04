/*
 * Renders a link to a This Is My Jam user's profile, with an image, text or both.
 * If the user has no active jam, renders a simple 'follow me' link.
 *
 * Usage
 * -----
 *
 *     <script src="http://www.thisismyjam.com/includes/js/medallion.js"></script>
 *     <script>Jam.Medallion.insert({username: "..."})</script>
 *
 * You can pass several options to Jam.Medallion.insert:
 *
 * - text: Set to false to stop showing the 'My current jam is:' tag.
 * - image: Set to false to stop showing the jam avatar.
 * - imageSize: "small" (default), "medium" or "large".
 *
 * Markup
 * ------
 *
 * The generated markup will look something like this:
 *
 * <div class="jam-medallion">
 *   <a class="jam-image" href="...">
 *     <img class="jam-jamvatar" src="...">
 *   </a>
 *
 *   <p class="jam-text">
 *     My current jam is <a href="...">...</a>.
 *   </p>
 * </div>
 *
 * A "jam-loading" class is added to the outer div while the jam data is being
 * loaded from the API, so that you can style it appropriately.
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

Jam.Medallion.prototype.hasActiveJam = function() {
  return this.json && this.json.hasOwnProperty('jam');
};

Jam.Medallion.prototype.hasImage = function() {
  return this.getOption('image', true);
};

Jam.Medallion.prototype.hasText = function() {
  return this.getOption('text', true);
};

Jam.Medallion.prototype.imageSize = function() {
  return this.getOption('imageSize', 'small');
};

Jam.Medallion.prototype.textLabel = function() {
  return this.getOption('textLabel', 'My current jam is: ');
};



Jam.Medallion.prototype.setJSON = function(json) {
  this.json = json;
};

// Initialization

Jam.Medallion.prototype.insertElement = function() {
  var id = 'jam-medallion-'+Math.floor(Math.random()*1000000);
  document.write('<div class="jam-medallion jam-loading" id="'+id+'"></div>');
  this.element = document.getElementById(id);
};

Jam.Medallion.prototype.fetch = function(element) {
  var medallion = this;

  Jam.getJSONP(
    'https://api.thisismyjam.com/1/' + this.username + '.json?callback=',

    function(json) {
      medallion.setJSON(json);
      medallion.render();
    }
  );
};

// Rendering

Jam.Medallion.prototype.render = function() {
  if (!this.element || !this.json) return;

  this.element.className = this.element.className.replace(/\bjam-loading\b/, '');
  this.element.innerHTML = '';

  if (this.hasActiveJam()) {
    if (this.hasImage()) {
      this.element.appendChild(this.createImageElement());
    }

    if (this.hasText()) {
      this.element.appendChild(this.createTextElement());
    }
  } else {
    this.element.className += ' jam-inactive';
    this.element.appendChild(this.createNoJamTextElement());
  }
};

Jam.Medallion.prototype.typeSlug = function() {
  var components = [];

  if (this.hasActiveJam()) {
    if (this.hasText()) {
      components.push('text');
    }

    if (this.hasImage()) {
      components.push('image');
      components.push(this.imageSize());
    }
  } else {
    components.push('inactive');
  }

  return components.join('-');
};

Jam.Medallion.prototype.createImageElement = function() {
  var imageSize = this.imageSize();
  var imageKey  = 'jamvatar' + imageSize[0].toUpperCase() + imageSize.substring(1);

  var imageElement = document.createElement('img');
  imageElement.className = 'jam-jamvatar';
  imageElement.src = this.json.jam[imageKey].replace("api.thisismyjam","thisismyjam");
  if (imageKey == 'jamvatarSmall') {
      imageElement.setAttribute('height', '80'); imageElement.setAttribute('width', '80');
  }
  else if (imageKey == 'jamvatarMedium') {
      imageElement.setAttribute('height', '185'); imageElement.setAttribute('width', '185');
  }
  else if (imageKey == 'jamvatarLarge') {
      imageElement.setAttribute('height', '395'); imageElement.setAttribute('width', '395');
  }
    
  var linkElement = this.createLinkElement('image');
  linkElement.className = 'jam-image';
  linkElement.appendChild(imageElement);

  return linkElement;
};

Jam.Medallion.prototype.createTextElement = function() {
  var textLabel = this.textLabel();
  var textElement = document.createElement('p');
  textElement.className = 'jam-text';
  textElement.innerHTML = Jam.escapeHTML(textLabel+" ");

  var linkElement = this.createLinkElement('text');
  linkElement.innerHTML += '&ldquo;' + Jam.escapeHTML(this.json.jam.title) + '&rdquo;';
  linkElement.innerHTML += Jam.escapeHTML(' by ' + this.json.jam.artist);
  textElement.appendChild(linkElement);

  return textElement;
};

Jam.Medallion.prototype.createNoJamTextElement = function() {
  var textElement = document.createElement('p');
  textElement.className = 'jam-text';

  var linkElement = this.createLinkElement('text');
  linkElement.innerHTML = Jam.escapeHTML('Follow me on This Is My Jam');
  textElement.appendChild(linkElement);

  return textElement;
};

Jam.Medallion.prototype.createLinkElement = function(linkType) {
  var linkElement = document.createElement('a');
  linkElement.href = this.linkURL(linkType);
  linkElement.target = '_blank';
  return linkElement;
};

Jam.Medallion.prototype.linkURL = function(linkType) {
  return 'http://www.thisismyjam.com/'+this.username+'?utm_source=user&utm_medium=medallion&utm_campaign='+this.typeSlug()+'&utm_content='+linkType;
}
