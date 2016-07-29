XMPPTestApp
===========
This is a very simple Alloy/Titanium-based example app for Android and iOS which
main purpose is to demonstrate the commonly used features in the
[ti-simple-xmpp](https://github.com/confcompass/ti-simple-xmpp) library.

Features
========
This app deliberately has a bare bones look, but contains many features
resembling a mainstream chat application:

* Login screen to connect on behalf of a XMPP user through a websocket
* Contacts overview displaying subscribed users, their statuses, and the number
  of unread messages
* Adding and removing contacts to personal roster
* Sending and receiving chat messages
* Chat states will be set and displayed while chatting, e.g. typing, active
* Displaying VCard information

Prerequistes
============
* [Titanium](http://www.appcelerator.com) (version 5.2.3 or newer)
* Alloy
* ti-simple-xmpp and its dependencies
* An XMPP server with websockets enabled. When using
  [ejabberd](https://www.ejabberd.im), check if the following lines are present
  and enabled in the `ejabberd.yml` configuration file:

```yaml
request_handlers:
  "/websocket": ejabberd_http_ws
```

License
=======
This example app is licensed under the Apache Public License (Version 2). Please
see the LICENSE file for the full license.

Stuff our legal folk make us say
================================
Appcelerator, Appcelerator Titanium and associated marks and logos are 
trademarks of Appcelerator, Inc.

Titanium is Copyright (c) 2008-2016 by Appcelerator, Inc. All Rights Reserved.

Titanium is licensed under the Apache Public License (Version 2). Please
see the LICENSE file for the full license.
