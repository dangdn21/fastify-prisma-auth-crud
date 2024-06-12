import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productResponseSchema")
        }
      }
    },
    createProductHandler
  ),
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    getProductsHandler
  )
}

export default productRoutes;