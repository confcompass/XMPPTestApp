/**
 * @class Observable
 *
 * Objects inheriting from the Observable prototype are typically considered
 * data in the Model-View-Controller (MVC) paradigm.
 */

/**
 * @constructor
 * Creates a new observable without any observers registered.
 */
function Observable() {
    this.observers = [];
}

/**
 * Registers an observer so that it will be notified when a change has occured.
 *
 * @param {function(object)} observer A callback function that gets invoked in case of a change
 */
Observable.prototype.registerObserver = function(observer) {
    this.observers.push(observer);
};

/**
 * Unregisters an observer so that it will no longer be notified when a change
 * has occured. Every function that has registered itself, should also
 * eventually unregister, so that the attached resources will be garbage
 * collected.
 *
 * @param {function(object)} observer A callback function that gets invoked in case of a change
 */
Observable.prototype.unregisterObserver = function(observer) {
    this.observers = this.observers.filter(function(observerItem, index, array) {
        return (observerItem !== observer);
    });
};

/**
 * Notifies all registered observers.
 *
 * @param {Object} args Arbitrary object that is passed as payload to each observer
 */
Observable.prototype.notifyObservers = function(args) {
    for(var i = 0; i < this.observers.length; i++) {
        this.observers[i](args);
    }
};

exports.Observable = Observable;
