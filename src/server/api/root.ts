
/* eslint-disable */
import { postsRouter } from "./routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { ProfileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  
  posts: postsRouter,
  profile: ProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
