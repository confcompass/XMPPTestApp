var roster = require('model/roster').roster;

var user;

// Data initialization

function setUser(_user) {
    user = _user;
    
    user.getVCard(function(vcard) {
        $.vcard.value = "VCard:\n\n";
        
        for(var key in vcard) {
            var value = vcard[key];
            $.vcard.value += key + "=" + value + "\n";
        }
    });
}

exports.setUser = setUser;

// Event handlers

function removeContact(e) {
    roster.unsubscribe(user.username);
    alert("User: "+user.username+" has been unsubscribed!\n");
}
