/* eslint-disable */

import Image from "next/image";
import Link from "next/link"




import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import { relative } from "path";
import relativetTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativetTime);

//import { LoadingPage } from "src/components/loading";



type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser )=>{
  const {post,author} = props;

  return (
  <div key={post.id} className="p-4 flex gap-3 border-b border-slate-400"> 
    <Image src={author.profileImageUrl} className=" h-14 w-14 rounded-full" alt="pfp" 
    width={56}
    height={56}
    />
    <div className="flex flex-col"> 
    <div className="flex  text-slate-300 gap-1"> 
    
    <Link href={`/@${author.username}`}><span>{`@${author.username}`} </span> </Link> 
    <Link href={`/post/${post.id}`}>
    <span className="font-thin"> {` · ${dayjs(
      post.createdAt
      ).fromNow(true)} ago`}</span> 
      </Link>
    </div>
          <span className="text-2xl">{post.content}</span>
    

    </div>
   </div>
  );

}