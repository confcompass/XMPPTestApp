var roster = require('model/roster').roster;

// Event handlers

function setStatusText() {
    roster.setStatusText($.statusText.value);
    $.setstatustext.close();
}
