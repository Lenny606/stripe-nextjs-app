"use server";

import {stripe} from "@/lib/stripe"

type Props = {
    userId: string
    email: string
    priceId: string
}

export const subscribe = async ({userId, email, priceId}: Props) => {
    if (!userId || !email || !priceId) {
        throw new Error("Missing required parameters")
    }

    try {
        const customer = await stripe.customer.list({
            email,
            limit: 1
        })
        let customerId = customer.data.length > 1 ?
            customer.data[0]?.id : null

        if(!customer) {
            const customerNew = await stripe.customers.create({
                email,

            })
            customerId = customerNew.id
        }

        //create payment for subscription
        const {url} = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            metadata: {
                userId
            },
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_URL}/payments/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/payments/cancel`
        })

        return url
    } catch (err) {
        console.log(err)
    }
}