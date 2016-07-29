var connection = require('model/connection');
var xmppeventhandler = require('controller/xmppeventhandler'); // Not used, but required to let the app respond to XMPP events

// Data initialization

$.username.value = connection.username;
$.domain.value = connection.domain;
$.resource.value = connection.resource;
$.url.value = connection.url;
$.password.value = connection.password;

// Event handlers

function doConnect(e) {
    // Take and check parameters

    if($.url.value == "") {
        alert("No web socket URL has been provided!");
        return;
    } else if($.username.value == "") {
        alert("No username has been provided!");
        return;
    } else if($.domain.value == "") {
        alert("No domain has been provided!");
        return;
    }

    // Save the settings
    connection.set({
        username: $.username.value,
        domain: $.domain.value,
        resource: $.resource.value,
        url: $.url.value,
        password: $.password.value
    });
    connection.write();
    
    // Connect to the XMPP server
    connection.connect();
}

if(OS_ANDROID) {
    $.login.open();
}
