#!/bin/sh -e

( echo "John Doe"
  echo "My Company"
  echo "My Organization"
  echo "My City"
  echo "My State"
  echo "US"
  echo "yes"
) | keytool --genkeypair --alias XMPPTestApp --keystore ./keystore --storepass mykeystore
