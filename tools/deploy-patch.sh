#!/usr/bash
npm run build && git commit -am "snapshot changes for `npm view clan-fp version`" && npm version patch && git push origin HEAD && npm publish