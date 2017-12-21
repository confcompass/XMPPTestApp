/**
 * Manages the connection with the XMPP server.
 * @module model.connection
 */

var xmpp = require('ti-simple-xmpp').SimpleXMPP;

// Utility functions

function getFile() {
    return Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "connection.json");
}

/**
 * Sets the connectivity attributes
 *
 * @function
 * @param {Object} args Connectivity attributes
 * @param {string} args.username Username
 * @param {string} args.domain Domain name where the user belongs to
 * @param {string} args.resource Optional device resource id
 * @param {string} args.url Websocket URL
 * @param {string} args.password Password of the user
 */
function set(args) {
    exports.username = args.username;
    exports.domain = args.domain;
    exports.resource = args.resource;
    exports.url = args.url;
    exports.password = args.password;
}

exports.set = set;

/**
 * Writes the configuration to a JSON configuration file in the data directory
 * @function
 */
function write() {
    var file = getFile();
    file.write(JSON.stringify({
        username: exports.username,
        domain: exports.domain,
        resource: exports.resource,
        url: exports.url,
        password: exports.password
    }));
};

exports.write = write;

/**
 * @member Connection
 *
 * Connects to the XMPP server with the provided settings.
 */
function connect() {
    var jid = exports.username + "@" + exports.domain + "/" + exports.resource;
    
    xmpp.connect({
        websocket: { url: exports.url },
        jid: jid,
        password: exports.password,
        preferred: 'PLAIN',
        reconnect: true,
        skipPresence: false
    });
};

exports.connect = connect;

// Initialize data
// Read settings file if it exists and set the values

var file = getFile();

if(file.exists()) {
    var data = file.read().text;
    var settings = JSON.parse(data);
    set(settings);
    data = null;
    settings = null;
}

file = null;
