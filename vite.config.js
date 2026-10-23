import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function questionBankFile() {
  let projectRoot

  const questionBankPath = () =>
    path.join(projectRoot, 'data', 'questions.json')

  return {
    name: 'question-bank-static-file',
    configResolved(config) {
      projectRoot = config.root
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== '/data/questions.json') {
          next()
          return
        }

        try {
          const contents = readFileSync(questionBankPath())
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(contents)
        } catch (error) {
          next(error)
        }
      })
    },
    generateBundle() {
      try {
        this.emitFile({
          type: 'asset',
          fileName: 'data/questions.json',
          source: readFileSync(questionBankPath()),
        })
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), questionBankFile()],
})
