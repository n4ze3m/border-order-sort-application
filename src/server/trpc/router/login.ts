import { TRPCError } from "@trpc/server";
import { setCookie } from "cookies-next";
import { z } from "zod";

import { publicProcedure, router, } from "../trpc";

export const loginRouter = router({
    login: publicProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {

        const isUserExist = await ctx.prisma.user.findFirst({
            where: {
                email: input.email,
                password: input.password,
            }
        })

        if (!isUserExist) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid email or password",
            })
        }


        setCookie("login", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            req: ctx.req,
            res: ctx.res,
        },)
        setCookie("userId", isUserExist.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            req: ctx.req,
            res: ctx.res,
        },)


        return {
            success: true,
        }
    }),
});
