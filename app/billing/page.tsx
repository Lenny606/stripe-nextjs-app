"use client";
import {useUser} from "@clerk/nextjs";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getUser} from "@/actions/user.action";
import {subscribe} from "@/actions/stripe.action";

const ClientPage = () => {
    const {isLoaded, isSignedIn, user} = useUser();
    const [userData, setUserData] = useState<any>(null)
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

    const handleSubscribeButton = async () => {
        if (!isSignedIn) {
            throw new Error("not signed")
        }

        const url = await subscribe({
            userId: user?.id,
            email: user?.emailAdressess[0]?.emailAdress || "",
            priceId: process.env.NEXT_PUBLIC_MONTHLY_STRIPE_PRODUCT_ID!
        })

        if (url) {
            router.push(url)
        } else {
            throw new Error('Failed to subscribe')
        }
    }

    const editPaymentDetails = async () => {
        const url = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_ID!
        if (url) {
            url + "prefilled_email=" + user?.emailAdressess[0]?.emailAdress
        } else {
            throw new Error('Failed to edit payments')
        }
    }

    return (
        <div className="h-full flex flex-col items-center justify-center text-2xl">
            Hello, {user?.firstName} welcome to Clerk
            {
                userData?.isSubscribed || userData?.customerId ? (
                        <div>
                            <p className={'text-green-500 text-sm'}>You are subcribed</p>
                            <button onClick={editPaymentDetails} className={'bg-white text-black p-4 border rounded-md'}>Edit</button>
                        </div>
                    ) :
                    (
                        <div>
                            <p className={'text-red-500 text-sm'}>You are Not subcribed</p>
                            <button onClick={handleSubscribeButton} className={'bg-white text-black p-4 border rounded-md'}>Subscribe</button>
                        </div>
                    )

            }

        </div>
    );
};

export default ClientPage;
