var roster = require('model/roster').roster;

// Event handlers

function addUser(e) {
    var from = $.username.value;
    roster.subscribe(from);
    $.addcontact.close();
}
