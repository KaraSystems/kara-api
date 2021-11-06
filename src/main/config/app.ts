import express from 'express'
import setupStaticFiles from './static-files'
import setupMiiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupStaticFiles(app)
setupMiiddlewares(app)
setupRoutes(app)
export default app
