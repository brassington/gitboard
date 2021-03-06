#!/bin/bash

## Copyright (c) 2015 - Andreas Dewes
##
## This file is part of Gitboard.
##
## Gitboard is free software: you can redistribute it and/or modify
## it under the terms of the GNU Affero General Public License as
## published by the Free Software Foundation, either version 3 of the
## License, or (at your option) any later version.
##
## This program is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
## GNU Affero General Public License for more details.
##
## You should have received a copy of the GNU Affero General Public License
## along with this program. If not, see <http://www.gnu.org/licenses/>.

BUILD_DIR=build
SOURCE_DIR=src

CSS_FILES = /css/main.css

export PATH := 	./node_modules/.bin:$(PATH);

ifeq ($(ENVIRONMENT),production)
	BUILD_ENVIRONMENT=production
else
	BUILD_ENVIRONMENT=development
endif

ifeq ($(NAVIGATION),html5)
	ENV_SETTINGS=settings_html5_navigation.js
else
	ENV_SETTINGS=settings_hashtag_navigation.js
endif

all: $(BUILD_ENVIRONMENT)

clean:
	rm -rf $(BUILD_DIR)

chrome-development: npm bower assets scripts jsx templates env_settings scss chrome watch

chrome-production: npm bower assets scripts jsx templates env_settings scss chrome optimize

chrome-app-development: npm bower assets scripts jsx templates env_settings scss chrome-app watch

chrome-app-production: npm bower assets scripts jsx templates env_settings scss chrome-app optimize

production: npm bower assets scripts jsx templates env_settings scss optimize

development: npm bower assets scripts jsx templates env_settings scss copy_mainjs remove_material_design_docs watch

optimize: optimize-css optimize-rjs

npm:
	npm install

scss: $(SOURCE_DIR)/scss/main.scss
	mkdir -p $(BUILD_DIR)/static/css
	scss $(SOURCE_DIR)/scss/main.scss $(BUILD_DIR)/static/css/main.css

chrome:
	cp $(SOURCE_DIR)/chrome/* $(BUILD_DIR) -rf

chrome-app:
	cp $(SOURCE_DIR)/chrome-app/* $(BUILD_DIR) -rf

env_settings:
	cp $(SOURCE_DIR)/js/$(ENV_SETTINGS) $(BUILD_DIR)/static/js/env_settings.js

optimize-css:
	mkdir -p $(BUILD_DIR)/static/css
	# npm install -g clean-css
	# cleancss -o $(BUILD_DIR)/static/css/main.css $(addprefix $(BUILD_DIR)/static,$(CSS_FILES))

optimize-rjs:
	npm install -g requirejs
	r.js -o $(BUILD_DIR)/static/js/build.js

scripts:
	mkdir -p $(BUILD_DIR)/static/js
	rsync -rupE $(SOURCE_DIR)/js --include="*.js" $(BUILD_DIR)/static

templates:
	mkdir -p $(BUILD_DIR)
	rsync -rupE $(SOURCE_DIR)/templates/ --include="*.html" $(BUILD_DIR)

jsx:
	# jsx $(SOURCE_DIR)/js $(BUILD_DIR)/static/js -x jsx
	babel --presets es2015,react $(SOURCE_DIR)/js --out-dir $(BUILD_DIR)/static/js --source-maps inline

assets:
	rsync -rupE $(SOURCE_DIR)/assets $(BUILD_DIR)/static

.PHONY: scripts

bower:
	mkdir -p $(BUILD_DIR)/static
	bower install --config.directory=$(BUILD_DIR)/static/bower_components

copy_mainjs:
	cp $(BUILD_DIR)/static/js/main.js $(BUILD_DIR)/static/main.js

remove_material_design_docs:
	# Necessary to avoid github pages build issues
	rm -rf $(BUILD_DIR)/static/bower_components/bootstrap-material-design/docs/

watch:
	npm -g install live-server
	live-server build/
