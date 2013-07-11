all: public/jquery-1.10.2.min.js public/raphael-2.1.0.min.js

public/jquery-1.10.2.min.js:
	curl -o public/jquery-1.10.2.min.js http://code.jquery.com/jquery-1.10.2.min.js

public/raphael-2.1.0.min.js:
	curl -o public/raphael-2.1.0.min.js https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.0/raphael-min.js

clean:
	rm -f public/jquery-1.10.2.min.js public/raphael-2.1.0.min.js