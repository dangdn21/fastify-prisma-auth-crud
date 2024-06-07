import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Define the properties
const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional()
}

const productGenerated = {
  id: z.number(),
  createAt: z.string(),
  updateAt: z.string(),
}

// Define the schema
const createProductSchema = z.object({
  ...productInput
});

const productResponseSchema = z.object({
  ...productGenerated,
  ...productInput
});

const productsResponseSchema = z.array(productResponseSchema);

// export the type
export type CreateProductInput = z.infer<typeof createProductSchema>;

// export the schemas
export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  productsResponseSchema
}, {
  $id: "productSchemas"
})