/**
 * Contact row that appears in the contacts overview
 * @module view.contactrow
 */

/*
 * Creates a new contact row
 *
 * @function
 * @param {User} user User to display
 */
exports.createContactRow = function(user) {
    var row = Ti.UI.createTableViewRow({
        layout: 'vertical',
        hasChild: OS_IOS,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
    });

    var view = Ti.UI.createView({
        layout: 'vertical',
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
    });

    /* Construct labels for user properties */
    var statusLabel = Ti.UI.createLabel();
    var usernameLabel = Ti.UI.createLabel();
    var statusTextLabel = Ti.UI.createLabel({
        color: '#aaaaaa',
    });

    function notifyFromUser() {
        usernameLabel.setText(user.username);
        statusLabel.setText(user.state);
        statusTextLabel.setText(user.statusText);
    }

    notifyFromUser();
    user.registerObserver(notifyFromUser);

    view.add(usernameLabel);
    view.add(statusLabel);
    view.add(statusTextLabel);

    /* Construct unread messages label */
    var unreadMessagesLabel = Ti.UI.createLabel();

    function notifyFromMessageQueue() {
        unreadMessagesLabel.setText((user.messageQueue.length() > 0) ? user.messageQueue.length() : "");
    }
    notifyFromMessageQueue();
    user.messageQueue.registerObserver(notifyFromMessageQueue);
    view.add(unreadMessagesLabel);

    // Add composite view
    row.add(view);

    // Add click event listener for the row
    row.addEventListener('click', function(e) {
        var chatController = Alloy.createController('chat');
        chatController.setUser(user);
        Alloy.Globals.openWindow(chatController.getView());
    });

    // Return object that encapsulates the contact row properties
    return {
        user: user,
        notifyFromUser: notifyFromUser,
        notifyFromMessageQueue: notifyFromMessageQueue,
        view: row
    };
};

/**
 * Destroys the given contact row by unregistering the observers
 *
 * @function
 * @param {Object} row Contact row
 */
exports.destroyContactRow = function(row) {
    row.user.unregisterObserver(row.notifyFromUser);
    row.user.unregisterObserver(row.notifyFromMessageQueue);
};
