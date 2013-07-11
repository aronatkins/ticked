#!/usr/bin/python

import socket
import time
import random

a = [ 'yankee', 'hotel', 'foxtrot' ]
b = [ 'alpha', 'bravo', 'charley', 'delta' ]

udp_ip="127.0.0.1"
udp_port=8025

sleep_range = range(0,100)
sock = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )
try :
    while True :
    	ts = int(time.time() * 1000)
    	k1 = random.choice(a)
    	k2 = random.choice(b)
    	c = random.randint(1,1000000)
    	d = random.randint(1,100)
        m = '%d:%s:%s:%d:%d' % (ts,k1,k2,c,d)
        sock.sendto( m, (udp_ip, udp_port) )
        time.sleep(random.choice(sleep_range) / 1000.0)
finally :
    sock.close()
