"use client";
import { useUser } from "@clerk/nextjs";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getUser} from "@/actions/user.action";

const ClientPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData , setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUserData() {
      const userData = await getUser(user?.id || "")
      setUserData(userData)
    }

    if (isSignedIn) {
      getUserData()
    }

  }, [user, isSignedIn])

  return (
    <div className="h-full flex flex-col items-center justify-center text-2xl">
      Hello, {user?.firstName} welcome to Clerk
    </div>
  );
};

export default ClientPage;
