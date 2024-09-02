import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/users', async () => {
    const users = await prisma.user.findMany()

    return users
  })

  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(1, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      coverUrl: z.string().url(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { coverUrl, content, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        coverUrl,
        content,
        isPublic,
        userId: 'da578dc6-bbf1-4771-8df7-79b4f39d3880',
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const queryParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = queryParams.parse(request.params)

    const bodyParams = z.object({
      coverUrl: z.string().url(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { coverUrl, content, isPublic } = bodyParams.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        coverUrl,
        content,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
