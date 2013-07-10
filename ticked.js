var dgram = require('dgram');
var http  = require('http');
var url   = require('url');
var util  = require('util');
var sio   = require('socket.io');
var node_static = require('node-static');
var fs = require('fs');

// begin config.
var config = {
    buckets : 60,
    bucket_interval : 1000,
    bucket_check_interval : 250,

    receiver_http_address : undefined,
    receiver_http_port    : 8020,

    receiver_udp_address  : undefined,
    receiver_udp_port     : 8025,

    server_http_address  : undefined,
    server_http_port     : 8080,

    push_interval : 1000,

    doc_root : __dirname + '/public',
    doc_cache : 0,

    log_level : 'info'
};
// end config.

// todo: our own stats.

function logger() {
    var log = function() {};
    log.level = 'info';
    log.levels = ['trace','debug','info','warn','error'];
    log.log = function(level, message) {
        if (log.levels.indexOf(level) >= log.levels.indexOf(log.level)) {
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
            };
            util.log(level+': '+message);
        }
    };
    // TODO: code generate these.
    // TODO: use numeric levels where possible.
    log.error = function(message) { log.log('error',message); };
    log.warn = function(message) { log.log('warn',message); };
    log.info = function(message) { log.log('info',message); };
    log.debug = function(message) { log.log('debug',message); };
    log.trace = function(message) { log.log('trace',message); };
    return log;    
}

var log = logger();
log.level = config.log_level || 'info';

buckets = [];

function create_bucket(ts) {
    log.trace("creating bucket:"+ts);
    var bucket = {};
    bucket.ts = ts;
    bucket.data = {};
    return bucket;
}

function add_to_bucket(bucket, p, v) {
    var pub = bucket.data[p] || {};
    bucket.data[p] = pub;

    pub[v] = (pub[v] || 0) + 1;
}

function norm_ts(ts) {
    // ms since epoch w 60s step.    
    var bucket_ts = Math.floor(ts / config.bucket_interval) * config.bucket_interval;

    log.trace("ts:"+ts+":"+bucket_ts);
    return bucket_ts;
}

function get_bucket(ts) {
    ts = norm_ts(ts);

    log.trace("fetching bucket:"+ts);
    var bucket = null;
    if (buckets.length == 0) {
	// no buckets. just create one and move on.
	bucket = create_bucket(ts);
	buckets[0] = bucket;
    } else {
	// is the last bucket the one we need?
	last = buckets[buckets.length-1];
	if (last.ts == ts) {
	    // no resizing necessary.
	    return last;
	}

	// nope. add some
	var min_ts = ts - (config.bucket_interval * config.buckets);
	var ts_to_add = Math.max(min_ts, last.ts + config.bucket_interval);
	while (ts_to_add <= ts) {
	    bucket = create_bucket(ts_to_add);
	    buckets.push(bucket);
	    ts_to_add += config.bucket_interval;
	}

	// make sure that we don't have too many.
	while (buckets.length > config.buckets) {
	    buckets.shift();
	}

	// make sure we our data isn't too old.
	while (buckets[0].ts < min_ts) {
	    buckets.shift();
	}
    }
    log.trace("returning bucket:"+bucket);
    return bucket;
}

function get_bucket_now() {
    var date = new Date();
    var ts = date.getTime(); // ms since epoch.
    var bucket = get_bucket(ts);
}

function record(ts, pub_id, value) {
    var bucket = get_bucket(ts);
    add_to_bucket(bucket, pub_id, value);
}

// create the HTTP receiver.
var http_receiver = http.createServer(function (request, response) {
    var request_url = url.parse(request.url,true);
    var ts = request_url.query.t;
    var pub_id = request_url.query.p;
    var value  = request_url.query.v;

    record(ts, pub_id, value);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('OK\n');
});

// Create a UDP receiver.
var udp_receiver = dgram.createSocket('udp4', function(msg,rinfo) {
    log.debug('received udp message:'+msg.toString());

    var parts = msg.toString().split(':');

    if (parts.length === 3) {
        var ts = Number(parts.shift());
        var pub_id = parts.shift();
        // sometimes we get undefined shifting off here.
        var value  = parts.shift().replace(/[^a-zA-Z_\-0-9\.]/g, '');

        record(ts, pub_id, value);
    } else {
        log.error("bad udp message:"+msg);
    }
});

var file = new(node_static.Server)(config.doc_root, { cache: config.doc_cache || 0 });
// Create the HTTP server for the clients.
var server = http.createServer(function (request, response) {
                                   request.addListener('end', function() {
                                                           file.serve(request,response);
                                                       }).resume();
});

http_receiver.listen(config.receiver_http_port || 8020, 
		     config.receiver_http_address || undefined);
udp_receiver.bind(config.receiver_udp_port || 8025, 
		  config.receiver_udp_address || undefined);
server.listen(config.server_http_port || 8080,
	      config.server_http_address || undefined);

var io = sio.listen(server);
io.set('log level', 1);

// every n s, broadcast data from the most recent minute.
var push_interval = setInterval(function () {
    // todo: have different top-level channels.

    // todo: only push the most recent and have a different way of
    // fetching the historical data at first load.

    // tbd: have different top-level events.
    io.sockets.volatile.emit("ticked", buckets);
}, config.push_interval || 10000);

// make sure we have buckets even if there's no data arriving.
get_bucket_now();
setInterval(get_bucket_now, config.bucket_check_interval || 250);

log.info("ready to tick... you off.");
