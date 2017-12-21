var inherit = require('util/inherit').inherit;
var Observable = require('util/observable').Observable;
var xmpp = require('ti-simple-xmpp').SimpleXMPP;
var MessageQueue = require('model/messagequeue').MessageQueue;

/**
 * Creates a new user
 *
 * @class User
 * @extends Observable
 * @classdesc Represents a user that we have been connected to.
 *
 * @constructor
 * @param {String} username JID of the user
 * @param {Boolean} invited Whether the user has a pending invitation
 */
function User(username, invited) {
    Observable.call(this);

    this.username = username;
    this.invited = invited;
    this.state = "offline";
    this.statusText = "";
    this.messageQueue = new MessageQueue();
    this.hidden = false;

    // Probe the real status asynchronously
    this.probe();
}

// User inherits from Observable
inherit(Observable, User);

/**
 * Updates the state of the user
 *
 * @method
 * @param {String} state State of the user
 * @param {String} statusText Status text of the user
 */
User.prototype.updateState = function(state, statusText) {
    this.state = state;
    this.statusText = statusText;
    this.notifyObservers();
};

/**
 * Probes the state of the user
 * @method
 */
User.prototype.probe = function() {
    var self = this;
    
    xmpp.probe(self.username, function(state) {
        self.updateState(state, self.statusText);
    });
};

/**
 * Changes the visibility status of the user
 *
 * @method
 * @param {Boolean} hidden true iff the user should be hidden from the roster
 */
User.prototype.setHidden = function(hidden) {
    this.hidden = hidden;
};

/**
 * Fetches the VCard of the user
 *
 * @method
 * @param {function(object)} callback Function that gets invoked when the VCard
 *   has been obtained. The VCard is an object passed as the first parameter
 */
User.prototype.getVCard = function(callback) {
    xmpp.getVCard(this.username, callback);
};

/**
 * Changes the chat state that the user sees
 *
 * @method
 * @param {String} state Chat state that becomes visible to the user
 */
User.prototype.setChatstate = function(state) {
    xmpp.setChatstate(this.username, state);
};

/**
 * Sends a message to the user
 *
 * @method
 * @param {String} message Message to send
 */
User.prototype.send = function(message) {
    xmpp.send(this.username, message);
};

exports.User = User;
