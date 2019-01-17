start:
	npm run start

build:
	rm -rf dist
	NODE_ENV=production npm run webpack
