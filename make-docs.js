const fs = require('fs')
const globby = require('globby')
const marked = require('marked')

globby(['./docs/*.md', './endpoints/**/*.md', '!node_modules/**']).then(paths => {
  let content = ''
  paths.forEach(path => {
    content += fs.readFileSync(path, 'utf8')
  })
  const body = marked(content, { escapeMarkdown: false })

  const html = fs.readFileSync('./docs/index.html', 'utf8').replace('<Content />', body)

  fs.writeFileSync('./docs/dist/index.html', html, 'utf8')
}).catch(error => {
  console.error(error)
})
