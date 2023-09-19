/* eslint-disable */
import { clerkClient } from "@clerk/nextjs";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";


import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";

const addUserDataToPosts = async (posts: Post[])=>{
  const users =  (await clerkClient.users.getUserList({
    userId: posts.map ((post) => post.authorID),
    limit: 100,
})
).map(filterUserForClient);

console.log(users);
return posts.map((post) =>{
    const author = users.find((user)=> user.id===post.authorID)

    if(!author || !author.username) 
    throw new TRPCError ({
        code:"INTERNAL_SERVER_ERROR",
        message:"author for post not found"
    })
    
    return{
    post,
    author: {
        ...author,
        username: author.username,
    },

};});

}
// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({


  getById: publicProcedure.input(z.object({id:z.string()}))
  .query(async({ctx,input})=> {
    
    const post =   await  ctx.db.post.findUnique({
    where:{
      id: input.id,
    }
  });
  if(!post) throw new TRPCError ({
    code: "NOT_FOUND"
  });

  return (await addUserDataToPosts([post]))[0];
}
  ),
 
    
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await  ctx.db.post.findMany({
        take: 100,
        orderBy: [{
            createdAt: "desc"
        }]
    });

    return addUserDataToPosts (posts);

    
  }),

  getPostsByUserId : publicProcedure.input(z.object({
    userId: z.string(),
  })).query(({ctx,input})=>ctx.db.post.findMany({
    where: {
      authorID: input.userId,

    },
    take:100,
    orderBy: [{createdAt: "desc"}],
  }).then(addUserDataToPosts)
  
  ),

  create: privateProcedure.input(z.object({
    content: z.string().emoji("only emojis are allowed").min(1).max(280),
  })).mutation(async({ctx,input})=>{

    
    const authorID = ctx.userId;
    const {success} = await ratelimit.limit(authorID);

    if (!success) throw new TRPCError({
        code: "TOO_MANY_REQUESTS"
    });

    const post = await ctx.db.post.create({
        data: {
            authorID,
            content: input.content,
        },
    });
    return post;
  }),
});

