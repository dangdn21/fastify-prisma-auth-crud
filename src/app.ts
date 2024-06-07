import Fastify, { FastifyRequest, FastifyReply } from "fastify"
import fjwt, { FastifyJWT } from "@fastify/jwt"
import fCookie from "@fastify/cookie"
import userRoutes from "./modules/user/user.route"
import productRoutes from "./modules/product/product.route"
import { userSchemas } from "./modules/user/user.schema"
import { productSchemas } from "./modules/product/product.schema"
import fastify from "fastify"

const server = Fastify()


server.register(fjwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
})

server.addHook('preHandler', (req: FastifyRequest, res: FastifyReply, next) => {
  req.jwt = server.jwt
  return next()
})

server.register(fCookie, {
  secret: process.env.COOKIES_SECRET || 'supersecret',
  hook: 'preHandler'
})

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;

    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' })
    }

    const decoded = request.jwt.verify<FastifyJWT['user']>(token)
    request.user = decoded
  }
)

async function main() {

  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema)
  }

  server.register(require('@fastify/swagger'), {})
  server.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Fastify Prisma REST API',
        description: 'A REST API built with Fastify, Prisma and TypeScript',
        version: '1.0.0',
        contact: {
          name: "DangDn",
          url: "#",
          email: "doanngocdang96@gmail.com"
        },
      },
      externalDocs: {
        url: '#',
        description: 'Fastify Tutorial source code is on GitHub',
      },
      host: '0.0.0.0:3000',
      basePath: '/',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    uiConfig: {
      docExpansion: 'none', // expand/not all the documentations none|list|full
      deepLinking: true,
    },
    staticCSP: false,
    transformStaticCSP: (header: any) => header,
    exposeRoute: true
  });

  // Executes Swagger
  server.ready(err => {
    if (err) throw err
    server.swagger()
  })

  // Register routes
  server.register(userRoutes, { prefix: 'api' })
  server.register(productRoutes, { prefix: 'api/products' })


  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0'
    })
    console.log('Server running at http://localhost:3000')

  } catch (error) {
    console.log('Error starting server:', error)
    process.exit(1)
  }
}

main()