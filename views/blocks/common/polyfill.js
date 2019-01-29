if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

(function(ELEMENT) {
  ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
  ELEMENT.closest = ELEMENT.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;
    if (!this.parentElement) return null;
    return this.parentElement.closest(selector);
  };
}(Element.prototype));

(function () {
  // global DOMTokenList
  var dummy = document.createElement('div'),
    dtp = DOMTokenList.prototype,
    toggle = dtp.toggle,
    add = dtp.add,
    rem = dtp.remove;

  dummy.classList.add('class1', 'class2');

  // Older versions of the HTMLElement.classList spec didn't allow multiple
  // arguments, easy to test for
  if (!dummy.classList.contains('class2')) {
    dtp.add = function () {
      Array.prototype.forEach.call(arguments, add.bind(this));
    };
    dtp.remove = function () {
      Array.prototype.forEach.call(arguments, rem.bind(this));
    };
  }

  // Older versions of the spec didn't have a forcedState argument for
  // `toggle` either, test by checking the return value after forcing
  if (!dummy.classList.toggle('class1', true)) {
    dtp.toggle = function (cls, forcedState) {
      if (forcedState === undefined)
        return toggle.call(this, cls);

      (forcedState ? add : rem).call(this, cls);
      return !!forcedState;
    };
  }
})();


