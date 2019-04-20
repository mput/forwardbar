start:
	npm run start

start-local:
	LOCAL=true npm run start

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

load-menu:
	npx babel-node  ./bin/loadLunchMenu.js