import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, getUsers } from "./user.service";
import { verifyPassword } from "../../utils/hash";


export async function registerUserHandler(req: FastifyRequest<{
  Body: CreateUserInput
}>, res: FastifyReply) {
  const body = req.body;

  try {
    const user = await createUser(body);
    return res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }

  res.send({ message: "User registered successfully!" });
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  rely: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return rely.status(401).send({ message: "Invalid email or password" });
  }

  const isValidPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  })

  if (!isValidPassword) {
    return rely.status(401).send({ message: "Password is incorrect!" });
  }


  // Generate JWT token
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  }
  const token = request.jwt.sign(payload);

  rely.setCookie('access_token', token, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // a week
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  return { 
    accessToken: token
  }
}

export async function getUsersHandler() { 
  const users = await getUsers();  
  return users
}

export async function logoutHandler(req: FastifyRequest, res: FastifyReply) {
  res.clearCookie('access_token');
  return res.status(201).send({ message: 'Logged out successfully' });
}