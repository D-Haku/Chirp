/* eslint-disable */
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";





export const ProfileRouter = createTRPCRouter({
 
  getUserByUsername: publicProcedure.input(z.object({username:z.string()})).
  query(async({input})=>{

    const [user] = await clerkClient.users.getUserList({
        username: [input.username],
    });

    if (!user) {
        throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message: "user not found",
        });
    }
    return filterUserForClient(user);

  })
  
  
});
