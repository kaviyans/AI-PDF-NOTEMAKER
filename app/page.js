"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {api} from  "@/convex/_generated/api"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Loader2 } from "lucide-react";

export default function Home() {

  const { user, isLoaded } = useUser(); 
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();  

  useEffect(() => {
    if (!isLoaded) return; 

    if (user) {
      checkUser();
      router.push("/dashboard");  
    } else {
      router.push("/sign-in");  
    }
  }, [user, isLoaded]);

  const checkUser = async ()=>{
    const result = await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      imageUrl:user?.imageUrl,
      userName:user?.fullName
    });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <h1 className="text-lg font-semibold text-gray-700">Loading...</h1>
      </div>
    </div>
  );
}
