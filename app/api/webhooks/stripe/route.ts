import {stripe} from '@/lib/stripe'
import User from '@/modals/user.modal'
import {headers} from 'next/headers'
import {NextResponse, NextRequest} from 'next/server'
import Stripe from 'stripe'
import {revalidaPath} from 'next/cache'

export async function POST(request: NextRequest) {
    //from stripe event
    const body = await request.text()
    const signature = headers().get("Stripe-Signature")
    let event: Stripe.event
    let data: any
    let eventType: any

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch (e) {
        console.log(e)
        return new NextResponse('error', {status: 400})
    }

    data = event.data
    eventType = event.type

    if (eventType === "checkout.session.completed") {
        const session = await stripe.checkout.sessions.retrieve(
            data?.object?.id, {expand: ['lines_items']})

        const customerId = session?.customer
        const customer = await stripe.customers.retrieve(customerId as string)
        const priceId = session?.line_items?.dataq[0]?.price?.id
        const metadata = event?.data?.object?.metadata

        if (priceId !== process.env.NEXT_PUBLIC_MONTHLY_STRIPE_PRODUCT_ID) {
            return new NextResponse("ID invalid", {status: 400})
        }

        if (metadata) {
            const userId = metadata.userId
            const updatedUser = await User.findOneAndUpdate({
                    clerkId: userId
                }, {

                    isSubscribed: true,
                    customerId: customerId

                },
                {
                    new: true
                })
            if (!updatedUser) {
                return NextResponse("user not founf")
            } else {
                console.log("success")
            }
        }

    }

    revalidaPath("/", "layout")
    return new NextResponse("Webhook received", {status: 200})

}