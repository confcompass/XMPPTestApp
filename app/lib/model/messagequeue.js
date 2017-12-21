var inherit = require('util/inherit').inherit;
var Observable = require('util/observable').Observable;

/**
 * Constructs a new MessageQueue
 *
 * @class MessageQueue
 * @extends Observable
 * @classdesc Stores unread messages that have been sent by a specific user.
 * @constructor
 */
function MessageQueue() {
    Observable.call(this);

    this.messages = [];
    this.state = "gone";
}

// MessageQueue inherits from Observable
inherit(Observable, MessageQueue);

/**
 * Pushes a message into the queue.
 *
 * @method
 * @param {String} message Message to add to the queue
 */
MessageQueue.prototype.push = function(message) {
    this.messages.push(message);
    this.notifyObservers("messages");
};

/**
 * Returns the amount of messages in the queue.
 *
 * @method
 * @return {Number} Amount of messages in the queue
 */
MessageQueue.prototype.length = function() {
    return this.messages.length;
};

/**
 * Removes all messages from queue and returns them.
 *
 * @method
 * @return {Array<String>} All unread messages
 */
MessageQueue.prototype.shiftAll = function() {
    if(this.messages.length > 0) {
        var messages = this.messages;
        this.messages = [];
        this.notifyObservers("messages");
        return messages;
    } else {
        return [];
    }
};

/**
 * Sets the state of the user.
 *
 * @method
 * @param {String} state State of the user
 */
MessageQueue.prototype.setState = function(state) {
    if(this.state != state) {
        this.state = state;
        this.notifyObservers("state");
    }
};

exports.MessageQueue = MessageQueue;
