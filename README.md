Ticked
======

Collect stuff over UDP, show graphs.

Getting Started
---------------

1. grab node. <http://nodejs.org/>

        NODE_VERSION=v0.10.12
        curl -O http://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}.tar.gz
        tar zxvf node-${NODE_VERSION}.tar.gz
        cd node-${NODE_VERSION}
        ./configure --prefix=${HOME}/opt/node-${NODE_VERSION}
        make -j8
        make install
        cd ..

    Of course, you want this to be the version you use.

        (cd ${HOME}/opt && rm -f node && ln -s node-${NODE_VERSION} node)

2. node path

        NODE_HOME=${HOME}/opt/node
        export PATH=$PATH:${NODE_HOME}/bin

3. install dependencies (be sure to be inside this directory)

	    # Inside the ticked directory; installing locally
        npm install

        (cd public && curl -O http://code.jquery.com/jquery-1.10.2.min.js)
        (cd public && curl -o raphael-2.1.0.min.js https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.0/raphael-min.js)

4. start the ticked server.

        node ticked.js

5. send some data.

        ./sender.py

6. point a browser at the server. <http://localhost:8080>

Sending Data
------------

UDP data is accepted. The message format is colon ':' separated. You can test from the command-line like:

    # on mac
    echo "toplevel:groovy" | nc -u -w 0 localhost 8025

    # on linux
    echo "toplevel:groovy" | nc -u -q 0 localhost 8025

Limitations
-----------

It sucks.
