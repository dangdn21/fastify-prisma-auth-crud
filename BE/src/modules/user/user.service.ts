import { db } from "../../utils/prisma"
import { CreateUserInput } from "./user.schema"
import { hashPassword } from "../../utils/hash"

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input
  const { hash, salt } = hashPassword(password)

  const user = await db.User.create({
    data: {
      ...rest,
      password: hash,
      salt
    }
  })

  return user
}

export async function findUserByEmail(email: string) {
  const user = await db.User.findFirst({
    where: {
      email
    }
  })

  return user
}

export async function getUsers() {
  const users = await db.User.findMany({
    select: {
      id: true,
      email: true,
      name: true
    }
  })

  return users
}