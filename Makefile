JS_DEPS=\
	public/jquery-1.10.2.min.js \
	public/raphael-2.1.0.min.js \
	public/cubism.v1.min.js \
	public/d3.v3.min.js

all: ${JS_DEPS}

public/jquery-1.10.2.min.js:
	curl -o public/jquery-1.10.2.min.js http://code.jquery.com/jquery-1.10.2.min.js

public/raphael-2.1.0.min.js:
	curl -o public/raphael-2.1.0.min.js https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.0/raphael-min.js

public/cubism.v1.min.js:
	curl -o public/cubism.v1.min.js https://raw.github.com/square/cubism/master/cubism.v1.min.js
	
public/d3.v3.min.js:
	curl -o public/d3.v3.min.js http://d3js.org/d3.v3.min.js

clean:
	rm -f ${JS_DEPS}