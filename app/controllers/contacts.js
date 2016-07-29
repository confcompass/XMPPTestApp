var roster = require('model/roster').roster;
var contactrow = require('view/contactrow');

var rows = [];

// Utility functions

function displayShow() {
    switch(roster.show) {
        case "chat":
            return "Chat";
        case "dnd":
            return "Do not disturb";
        case "away":
            return "Away";
        case "xa":
            return "Extended away";
    }
}

// Notification handler

function notify() {
    $.show.text = displayShow();
    $.statusText.text = "Status: " + roster.statusText;
    
    var index = 3;
    var usernames = roster.fetchUsernames();
    var numOfRows = $.table.data[0].rowCount;
    
    usernames.forEach(function(username) {
        var user = roster.users[username];
        
        if(!user.hidden) {
            var row = contactrow.createContactRow(user);
             
            if(index < numOfRows) {
                var oldRow = rows[index - 3];
                contactrow.destroyContactRow(oldRow);
                
                $.table.updateRow(index, row.view);
                rows[index - 3] = row;
            } else {
                $.table.appendRow(row.view);
                rows.push(row);
            }
            
            index++;
        }
   });
   
   while(index < numOfRows) {
       // Delete the row that is on the successive index
       $.table.deleteRow(index);
       index++;
       
       // Destroy the trailing rows
       var row = rows.pop();
       contactrow.destroyContactRow(row);
   }
}

// Data initialization

notify();
roster.registerObserver(notify);

// Event handlers

function addContact() {
    var addContactView = Alloy.createController('addcontact').getView();
    Alloy.Globals.openWindow(addContactView);
}

function showChangePresenceDialog(e) {
    $.changePresenceDialog.show();
}

function changePresence(e) {
    var show;
    
    switch(e.index) {
        case 0:
            show = "chat";
            break;
        case 1:
            show = "dnd";
            break;
        case 2:
            show = "away";
            break;
        case 3:
            show = "xa";
            break;
    }
    
    roster.setPresence(show);
}

function changeStatusText(e) {
    var setStatusTextView = Alloy.createController('setstatustext').getView();
    Alloy.Globals.openWindow(setStatusTextView);
}

function closeWindow(e) {
    var rowsLength = rows.length;
    
    for(var i = 0; i < rowsLength; i++) {
        var row = rows.pop();
        contactrow.destroyContactRow(row);
    }
    
    roster.unregisterObserver(notify);
}
