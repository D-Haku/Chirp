import Head from "next/head";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";

import { SignInButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
//import { LoadingPage } from "src/components/loading";
import { loadingPage } from "~/components/loading";
import { useState } from "react";


dayjs.extend(relativeTime);

const CreatePostWizard = ()=>{

  const {user} = useUser();

  const [input,setInput] = useState<string>();
  
  const ctx = api.useContext();

  const {mutate,isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess:()=>{
      setInput("");
      void ctx.posts.getAll.invalidate()
    }
  });

  

  if (!user) return null;


  return <div className="flex gap-3 w-full ">
    <Image src={user.imageUrl} alt="profile image" className="w-14 h-14 rounded-full"
    width={56}
    height={56}
    
    />
    <input  placeholder="whats happening?!"  className=" grow bg-transparent outline-none "
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    disabled={isPosting}
    />
    <button onClick={()=>mutate({content: input})}>post</button>
  </div>
}
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser )=>{
  const {post,author} = props;

  return (
  <div key={post.id} className="p-4 flex gap-3 border-b border-slate-400"> 
    <Image src={author.profileImageUrl} className=" h-14 w-14 rounded-full" alt="pfp" 
    width={56}
    height={56}
    />
    <div className="flex flex-col"> 
    <div className="flex  text-slate-300 gap-1"> 
    <span>{`@${author.username}`} </span>  <span className="font-thin"> {` · ${dayjs(
      post.createdAt
      ).fromNow(true)} ago`}</span> 
    </div>
          <span className="text-2xl">{post.content}</span>
    

    </div>
   </div>
  );

}

const Feed = ()=>{
  const { data , isLoading: postsLoading} = api.posts.getAll.useQuery();

  if(postsLoading) return <loadingPage/>

  if(!data) return <div>something went wrong </div>

  return(
    <div className="flex flex-col">
          {data.map((fullPost)=>(
            <PostView {...fullPost} key={fullPost.post.id}/>
          ))}
        </div>
  )
}

export default function Home() {
 
  const  { isLoaded: userLoaded, isSignedIn  } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded ) return <div/>;



  


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex h-screen justify-center'>
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
        <div className="border-b border-slate-400 p-4">
          {!isSignedIn && ( 
          <div className="flex justify-center">

          
          <SignInButton/>
          </div>
          )}
          
          {isSignedIn && <CreatePostWizard/>}
          

        </div>
            <Feed/>
        
        </div>
      </main>
    </>
  );
}
