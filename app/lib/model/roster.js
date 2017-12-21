var inherit = require('util/inherit').inherit;
var Observable = require('util/observable').Observable;
var xmpp = require('ti-simple-xmpp').SimpleXMPP;
var MessageQueue = require('model/messagequeue').MessageQueue;
var User = require('model/user').User;

/**
 * Constructs a new roster
 *
 * @class Roster
 * @extends Observable
 * @classdesc Stores all chat related information including users that we have been connected with.
 * @constructor
 */
function Roster() {
    Observable.call(this);

    this.users = {};
    this.show = "chat";
    this.statusText = "";
};

exports.Roster = Roster;

// Roster inherits from Observable
inherit(Observable, Roster);

/**
 * Invites a user to become friends
 *
 * @method
 * @param {String} from JID of the user
 */
Roster.prototype.subscribe = function(from) {
    xmpp.subscribe(from);
    this.users[from] = new User(from, true);
    this.notifyObservers();
};

/**
 * Accepts a friend request of a user
 *
 * @method
 * @param {String} from JID of the user
 */
Roster.prototype.acceptSubscription = function(from) {
    xmpp.acceptSubscription(from);
};

/**
 * Removes a user as a friend
 *
 * @method
 * @param {String} from JID of the user
 */
Roster.prototype.unsubscribe = function(from) {
    this.users[from].setHidden(true);
    xmpp.unsubscribe(from);
    this.notifyObservers();
};

/**
 * Accepts an unfriend request from a user
 *
 * @method
 * @param {String} from JID of the user
 */
Roster.prototype.acceptUnsubscription = function(from) {
    xmpp.acceptUnsubscription(from);
};

/**
 * Change your presence status
 *
 * @method
 * @param {String} show Presence status (see xmpp.setPresence())
 */
Roster.prototype.setPresence = function(show) {
    this.show = show;
    xmpp.setPresence(show, this.statusText);
    this.notifyObservers();
};

/**
 * Change your status text
 *
 * @method
 * @param {String} statusText Status text
 */
Roster.prototype.setStatusText = function(statusText) {
    this.statusText = statusText;
    xmpp.setPresence(this.show, statusText);
    this.notifyObservers();
};

/**
 * Returns all the JIDs of the users in the roster
 *
 * @method
 * @return {Array<String>} Array of JIDs
 */
Roster.prototype.fetchUsernames = function() {
    return Object.keys(this.users).sort();
};

/**
 * Adds a user to the roster
 *
 * @method
 * @param {String} username JID of the user
 */
Roster.prototype.addUser = function(username) {
    this.users[username] = new User(username, false);
};

/**
 * Removes a user from the roster
 *
 * @method
 * @param {String} username JID of the user
 */
Roster.prototype.removeUser = function(username) {
    delete this.users[username];
};

// Create and export a singleton roster instance
exports.roster = new Roster();
