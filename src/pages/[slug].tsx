/* eslint-disable */
import Head from "next/head";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";



import { api } from "~/utils/api";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateServerHelper } from "~/server/helpers/ssghelper";




const ProfileFeed = (props:{userId:string})=>{
  const {data,isLoading} = api.posts.getPostsByUserId.useQuery({userId:props.userId})

  if(isLoading) return <div className="translate-y-0.4"><LoadingPage/></div>;

  if (!data || data.length === 0)return <div>user has not posted</div>

return <div className="flex flex-col">

{data.map((fullpost) => (<PostView {...fullpost} key={fullpost.post.id}/>))}
</div>

}


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
        <ProfileFeed userId={data.id}/>
        </PageLayout>
    </>
  );
}




export const getStaticProps: GetStaticProps = async (context) =>{
  const helpers = generateServerHelper();

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