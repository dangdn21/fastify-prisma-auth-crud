import { db } from "../../utils/prisma"
import { CreateProductInput } from "./product.schema"

export async function createProduct(data: CreateProductInput & { ownerId: number }) {
  const product = await db.Product.create({
    data
  })

  return product
  
}

export async function getProducts() {
  const products = await db.Product.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })

  return products
}