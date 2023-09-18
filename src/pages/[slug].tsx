/* eslint-disable */
import Head from "next/head";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";



import { api } from "~/utils/api";







const ProfilePage: NextPage <{username:string}> = ({username})=> {
 

const {data} = api.profile.getUserByUsername.useQuery({
  username,
});


if (!data) return <div></div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
        
      </Head>
      <PageLayout>
        <div className=" h-36  bg-slate-600
        relative
        ">
          <Image src={data.profileImageUrl} alt={`${data.username??""}'s profile pic`}
          width={128}
          height={128}

          className="-mb-[64px] absolute bottom-0 left-0 ml-4
          rounded-full border-4 border-black bg-black
          "
          />
        <div>
          
        
        </div>
        
        </div>
      
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username??""}`} </div> 
        <div className="w-full border-b border-slate-400"></div>
        </PageLayout>
    </>
  );
}
import { createServerSideHelpers } from '@trpc/react-query/server';

import superjson from 'superjson';
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { PageLayout } from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) =>{
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {db, userId: null},
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if(typeof slug !=="string") throw new Error("no slug");

  const username = slug.replace("@","");

  await helpers.profile.getUserByUsername.prefetch({username});
  return {
    props:{
      trpcstate: helpers.dehydrate(),
      username,
    }
  }
}

export const getStaticPaths = () =>{
  return {paths:[],fallback:"blocking"};
}


export default ProfilePage;