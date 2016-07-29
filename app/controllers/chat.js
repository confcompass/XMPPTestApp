var user;
var changing = false;
var originalMessages = null;

// Utility functions

function clearComposingStatus(message) {
    if(originalMessages === null) {
        $.chat.value += message;
    } else {
        $.chat.value = originalMessages;
        originalMessages = null;
    }
}

// Notification handler

function notify(args) {
    if(args == "state") {
        switch(user.messageQueue.state) {
            case "gone":
                clearComposingStatus(user.username + " has left the conversation\n");
                break;
                
            case "active":
                clearComposingStatus(user.username + " has joined the conversation\n");
                break;
                
            case "composing":
                originalMessages = $.chat.value;
                $.chat.value += user.username + " is typing...\n";
                break;
                
            default:
                clearComposingStatus("");
                break;
        }
    } else {
        var messages = user.messageQueue.shiftAll();

        for(var i = 0; i < messages.length; i++) {
            if(originalMessages === null) {
                $.chat.value += user.username + ": " + messages[i] + "\n";
            } else {
                originalMessages +=  user.username + ": " + messages[i] + "\n";
            }
        }
    }
}

// Data initialization

function setUser(_user) {
    user = _user;
    $.username.setTitle(user.username);
    notify();
    user.messageQueue.registerObserver(notify);
}

exports.setUser = setUser;

// Event handlers

function stopChanging() {
    if(changing) {
        changing = false;
        user.setChatstate('active');
    }
}

function sendMessage(e) {
    stopChanging();
    
    $.chat.value += "me: " + $.input.value + "\n";
    user.send($.input.value);
    $.input.value = "";
    
    stopChanging();
}

function openWindow(e) {
    user.setChatstate('active');
}

function closeWindow(e) {
    user.messageQueue.unregisterObserver(notify);
    user.setChatstate('gone');
}

function changeInput(e) {
    if(!changing) {
        changing = true;
        user.setChatstate('composing');
    }
}

function stopInput(e) {
    stopChanging();
}

function showContact(e) {
    var contactController = Alloy.createController('contact');
    contactController.setUser(user);
    Alloy.Globals.openWindow(contactController.getView());
}
