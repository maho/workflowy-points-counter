
README.md: bookmarklet.js Makefile
	perl -pe 's/\[bookmarklet.*$$/[bookmarklet](\$${BOOKMARKLET})/' README.md | BOOKMARKLET='$(shell cat bookmarklet.js)' envsubst > README.md

bookmarklet.js: pointsCounter.js
	node_modules/.bin/bookmarklet pointsCounter.js bookmarklet.js

install:
	npm install bookmarklet
