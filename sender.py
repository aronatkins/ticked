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
        m = '%s:%s' % (random.choice(a), random.choice(b))
        sock.sendto( m, (udp_ip, udp_port) )
        time.sleep(random.choice(sleep_range) / 1000.0)
finally :
    sock.close()
