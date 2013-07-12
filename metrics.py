#!/usr/bin/python

import socket
import sys
import time

udp_port = 8025

sock = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )
try :
    for line in sys.stdin.xreadlines() :
        parts = line.split('|')
        ts = int(time.time() * 1000)
        cdn_id = parts[2]
        pub_id = parts[5]
        bytes = parts[12]
        duration = parts[9]

        m = '%d:%s:%s:1:%d:%d' % (ts,cdn_id,pub_id,long(bytes),long(duration))
        for udp_ip in sys.argv[1:] :
          sock.sendto( m, (udp_ip, udp_port) )
finally :
    sock.close()