import express from 'express'
import setupMiiddlewares from './middlewares'

const app = express()
setupMiiddlewares(app)
export default app
