/**
 * class Roster
 *
 * Stores all chat related information including users that we have been
 * connected with.
 */

var inherit = require('util/inherit').inherit;
var Observable = require('util/observable').Observable;
var xmpp = require('ti-simple-xmpp').SimpleXMPP;
var MessageQueue = require('model/messagequeue').MessageQueue;
var User = require('model/user').User;

/**
 * @constructor
 * Constructs a new roster
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
 * @param {String} from JID of the user
 */
Roster.prototype.acceptSubscription = function(from) {
    xmpp.acceptSubscription(from);
};

/**
 * Removes a user as a friend
 *
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
 * @param {String} from JID of the user
 */
Roster.prototype.acceptUnsubscription = function(from) {
    xmpp.acceptUnsubscription(from);
};

/**
 * Change your presence status
 *
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
 * @return {Array.<String>} Array of JIDs
 */
Roster.prototype.fetchUsernames = function() {
    return Object.keys(this.users).sort();
};

/**
 * Adds a user to the roster
 *
 * @param {String} username JID of the user
 */
Roster.prototype.addUser = function(username) {
    this.users[username] = new User(username, false);
};

/**
 * Removes a user from the roster
 *
 * @param {String} username JID of the user
 */
Roster.prototype.removeUser = function(username) {
    delete this.users[username];
};

// Create and export a singleton roster instance
exports.roster = new Roster();
