var xmpp = require('ti-simple-xmpp').SimpleXMPP;
var roster = require('model/roster').roster;

// Event callbacks

// When an online event has been received, go the contacts screen

xmpp.on('online', function(data) {
    xmpp.getRoster();
    
    var contactsView = Alloy.createController('contacts').getView();
    Alloy.Globals.openWindow(contactsView);
});

// When a close event has been received, reconnect

xmpp.on('close', function() {
    alert("The connection has been closed! Navigate back to the login page to reconnect!");
});

// On receiving an error, display it
xmpp.on('error', function(err) {
    var message;
    
    if(typeof err == "string") {
        message = err;
    } else if(err.error) {
        message = err.error;
    } else {
        message = JSON.stringify(err);
    }
    
    alert('XMPP error: '+message);
});

// When a buddy request has been received, show a confirmation dialog

xmpp.on('subscribe', function(from) {
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [ 'yes', 'no' ],
        message: from + ' has added you to his contact list. Do you want to accept?',
        title: 'New contact'
    });
    dialog.addEventListener('click', function(e) {
        if(e.index == 0) {
            roster.acceptSubscription(from);
            
            var dialog = Ti.UI.createAlertDialog({
                cancel: 1,
                buttonNames: [ 'yes', 'no' ],
                message: 'Do you want to add ' + from + ' to your contacts list?',
                title: 'New contact'
            });
            dialog.addEventListener('click', function(e) {
                if(e.index == 0) {
                    roster.subscribe(from);
                }
            });
            dialog.show();
        }
    });
    dialog.show();
});

// When a buddy unsubscription has been received, show a confirmation dialog

xmpp.on('unsubscribe', function(from) {
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [ 'yes', 'no' ],
        message: from + ' has removed you from his contact list. Do you want to accept?',
        title: 'Lost contact'
    });
    dialog.addEventListener('click', function(e) {
        if(e.index == 0) {
            roster.acceptUnsubscription(from);
            xmpp.getRoster();
        }
    });
    dialog.show();
});

// When a buddy's state changes, we update the user's state

xmpp.on('buddy', function(jid, state, statusText, resource) {
    var user = roster.users[jid];
    if(user !== undefined) {
        user.updateState(state, statusText);
    }
});

// When a message is being received we add it to the message queue

xmpp.on('chat', function(from, message) {
    var user = roster.users[from];
    if(user !== undefined) {
        user.messageQueue.push(message);
    }
});

// When a user's chatstate changes, we update the user's state

xmpp.on('chatstate', function(from, state) {
    var username = from.substr(0, from.indexOf('/')); // Strip off the resource component
    var user = roster.users[username];

    if(user !== undefined) {
        user.messageQueue.setState(state);
    }
});

// When a raw stanza is received
xmpp.on('stanza', function(stanza) {

    // Process a received roster
    if(typeof stanza == "object" && stanza !== null && stanza.name == "iq" && stanza.id == "roster_0" && stanza.type == "result" && Array.isArray(stanza.children)) {
        var changed = false;
        
        for(var i = 0; i < stanza.children.length; i++) {
            var child = stanza.children[i];
           
            if(typeof child == "object" && child !== null && child.name == "query" && typeof child.attrs == "object" && child.attrs !== null && child.attrs.xmlns == "jabber:iq:roster" && Array.isArray(child.children)) {
                for(var j = 0; j < child.children.length; j++) {
                    var subchild = child.children[j];
                   
                    if(typeof subchild == "object" && subchild !== null && subchild.name == "item" && typeof subchild.attrs == "object" && subchild.attrs !== null) {
                        var user = roster.users[subchild.attrs.jid];
                        
                        if(subchild.attrs.subscription == "to" || subchild.attrs.subscription == "both") { // If we have some subscription to the corresponding user
                            if(user === undefined) {
                                roster.addUser(subchild.attrs.jid);
                                changed = true;
                            } else {
                                user.invited = false; // A user in the roster that has a subscription, is no longer considered invited
                            }
                        } else {
                            if(user !== undefined && !user.invited) { // Only remove non-invited users in the roster that are no longer subscribed
                                roster.removeUser(subchild.attrs.jid);
                                changed = true;
                            }
                        }
                    }
                }
            }
        }
        
        // If we have detected a change to the roster, then we have to notify all observers
        if(changed) {
            roster.notifyObservers();
        }
    }
});
