"use client"
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {api} from  "@/convex/_generated/api"
import { useEffect } from "react";

import Image from "next/image";

export default function Home() {

  const {user} = useUser();
  const createUser = useMutation(api.user.createUser)

  useEffect(()=>{
    user&&checkuser();
  },[user])

  const checkuser = async ()=>{
    const result = await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      imageUrl:user?.imageUrl,
      userName:user?.fullName
    });

    console.log(result);
  } 

  return (
    <div>
      <h1>hello</h1>
      <Button>subscibe</Button>

      <UserButton />
    </div>
  );
}
