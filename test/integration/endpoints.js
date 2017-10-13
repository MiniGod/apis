/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable import/first */
// Turn test mode on
process.env.INTEGRATION = true

import fs from 'fs'
import path from 'path'
import fileModule from 'file'
import nock from 'nock'

const testDir = 'tests'
const testFileName = 'integration_test.js'
const mockDataFilename = './mock-data.json'

before(() => {
  if (process.env.RECORD_MOCK_DATA) {
    nock.recorder.rec({
      output_objects: true,
      dont_print: true,
    })
  } else {
    nock.load(mockDataFilename)
  }
})

after(() => {
  if (process.env.RECORD_MOCK_DATA) {
    const nockCallObjects = nock.recorder.play()
    fs.writeFileSync(mockDataFilename, JSON.stringify(nockCallObjects, null, 2))
  }
})

describe('endpoint', () => {
  it('should load the server and set everything up properly', (done) => {
    const app = require(`${process.cwd()}/server`)

    app.on('ready', () => {
      fileModule.walkSync('./endpoints', (dirPath, dirs, files) => {
        if (dirPath.indexOf(testDir) < 0) return

        files.forEach((file) => {
          if (file !== testFileName) return

          const fullPath = `${dirPath}/${file}`

          if (!fs.existsSync(fullPath)) return
          if (path.extname(fullPath) !== '.js') return

          require(`../../${fullPath}`)
        })
      })

      done()
    })
  }).timeout(10000)
})
