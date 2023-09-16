import Head from "next/head";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";
export default function Home() {
 
  const  user = useUser();
  const { data } = api.posts.getAll.useQuery();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isSignedIn && <SignInButton/>}
          <span>

          </span>
          {!!user.isSignedIn && <SignOutButton/>}
          

        </div>

        <div>
          {data?.map((post)=>(<div>  {post.content}</div>))}
        </div>
        
      </main>
    </>
  );
}
