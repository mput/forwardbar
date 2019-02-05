start:
	npm run start

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

load-menu:
	npx babel-node  ./utils/menuLoader.js