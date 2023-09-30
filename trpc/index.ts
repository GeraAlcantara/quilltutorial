import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { db } from '@/db'

import { privateProcedure, publicProcedure, router } from './trpc'

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email) throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if (!dbUser) {
      //create user in db if not exists
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      })
    }

    return { success: true }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user, userId } = ctx

    return await db.file.findMany({
      where: {
        userId
      }
    })
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId
        }
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })
      await db.file.delete({
        where: {
          id: input.id
        }
      })

      return file
    })
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
