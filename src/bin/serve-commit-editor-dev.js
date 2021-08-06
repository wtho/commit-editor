#!/usr/bin/env node

const path = require('path')

require('ts-node').register({
  cwd: path.join(__dirname, '../../'),
  transpileOnly: true
})

require('../cli').run(__filename)
