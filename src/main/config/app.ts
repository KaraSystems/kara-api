import express from 'express'
import setupMiiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupMiiddlewares(app)
setupRoutes(app)
export default app
