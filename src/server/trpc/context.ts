import * as trpc from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { prisma } from '../db/client';

interface CreateContextOptions {
  // session: Session | null
  // @ts-ignore
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    prisma,

  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
) {
  // for API-response caching see https://trpc.io/docs/caching

  return {
    req: opts.req,
    res: opts.res,
    prisma,
  }
}
export type Context = inferAsyncReturnType<typeof createContext>;