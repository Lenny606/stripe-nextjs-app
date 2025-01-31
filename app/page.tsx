"use client"

import {useUser} from "@clerk/nextjs";

export default function Home() {
    const {isLoaded, isSignedIn, user} = useUser()

    if (!isLoaded) {
        return <div>Loading...</div>
    }
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-2xl">Home Page</div>
        </div>
    );
}
