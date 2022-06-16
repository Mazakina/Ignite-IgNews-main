import { NextApiResponse, NextApiRequest} from "next";
import { stripe } from "../../services/stripe";
import { getSession } from 'next-auth/react';
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
    ref:{
        id: string;
    },
    data:{
        stripe_customer_id: string;
    }
}

export default  async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === "POST"){
        const session = await getSession({ req })

        const user: User = await fauna.query(
            q.Get(
                q.Match(
                    q.Index('users_by_email'),
                    q.Casefold(session.user.email),
                )
            )
        )

        let customerId = user.data.stripe_customer_id
        console.log(customerId)

        if(!customerId){
            const stripeCustomer= await stripe.customers.create({
                email: session.user.email
            })
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data:{
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
            console.log(customerId)
    }

        

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types:['card'],
            billing_address_collection: 'required',
            line_items:[{
                price:'price_1Km0A3HUBGnwpr0SN5DWqwJO',
                quantity:1
            }],
            mode:'subscription',
            allow_promotion_codes:true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })
        return res.status(200).json({sessionId: checkoutSession.id})
    }else{
        res.setHeader('Allow', 'POST'   )
        res.status(405).end('Method not Allowed')
    }
}