
README.md: bookmarklet.js Makefile bookmarklet.template.html
	BOOKMARKLET='$(shell cat bookmarklet.js)' envsubst < bookmarklet.template.html > bookmarklet.html

bookmarklet.js: pointsCounter.js
	node_modules/.bin/bookmarklet pointsCounter.js bookmarklet.js

install:
	npm install bookmarklet
