/**
 * Acitve Elements with CssClass
 * This class is useful to mantain state about
 * the active element by css class.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * Author: Claudio Acioli
*/

class ActiveElement {
  
  constructor(className) {

    this._element = null;
    this._className = className;

    this._set = function(element) {
      if(!element)
        return;

      this._element = element;
      this._element.classList.add(this._className);
    };

    this._unset = function() {
      if(this._element)
        this._element.classList.remove(this._className);
      
      this._element = null;
    };

  }

  toggle(element) {
    this._unset();
    this._set(element);
  }

}
