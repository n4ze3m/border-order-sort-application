import { router } from "../trpc";
import { exampleRouter } from "./example";
import { loginRouter } from "./login";
import { orderRouter } from "./order";

export const appRouter = router({
  example: exampleRouter,
  auth: loginRouter,
  order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
