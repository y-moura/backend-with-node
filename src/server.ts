import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(cors, {
  //   origin: true, // all URLs on the front-end can call this back-end API
  origin: ['http:localhost:3333'],
})
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server running on http://localhost:3333')
  })
