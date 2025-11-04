import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type GlobalThis = typeof globalThis & {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = (globalThis as GlobalThis).prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  (globalThis as GlobalThis).prismaGlobal = prisma
}