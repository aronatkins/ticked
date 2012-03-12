Ticked
======

Collect stuff, show graphs.

Getting Started
---------------

1. grab node.
2. install socket.io
    npm install socket.io
3. start the ticked server.
4. send some data.
5. point a browser at the server.

Sending Data
------------

UDP data is accepted. The message format is colon ':' separated. You can test from the command-line like:

    # on mac
    echo "toplevel:groovy" | nc -u -w 0 localhost 8025

    # on linux
    echo "toplevel:groovy" | nc -u -q 0 localhost 8025
