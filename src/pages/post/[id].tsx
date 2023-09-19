/* eslint-disable */













/* eslint-disable */
import Head from "next/head";




import { api } from "~/utils/api";




const ProfileFeed = (props:{userId:string})=>{
  const {data,isLoading} = api.posts.getPostsByUserId.useQuery({userId:props.userId})

  if(isLoading) return <div className="translate-y-0.4"><LoadingPage/></div>;

  if (!data || data.length === 0)return <div>user has not posted</div>

return <div className="flex flex-col">

{data.map((fullpost) => (<PostView {...fullpost} key={fullpost.post.id}/>))}
</div>

}


const SinglePostPage: NextPage <{id:string}> = ({id})=> {
 

const {data} = api.posts.getById.useQuery({
  id,
});


if (!data) return <div></div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content}-@${data.author.username}`}</title>
        
      </Head>
      <PageLayout>
       <PostView {...data}/>
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
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";


export const getStaticProps: GetStaticProps = async (context) =>{
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {db, userId: null},
    transformer: superjson, // optional - adds superjson serialization
  });

  const id = context.params?.id;

  if(typeof id !=="string") throw new Error("no slug");

 

  await helpers.posts.getById.prefetch({id})
  return {
    props:{
      trpcstate: helpers.dehydrate(),
      id,
    }
  }
}

export const getStaticPaths = () =>{
  return {paths:[],fallback:"blocking"};
}


export default SinglePostPage;