import {NextApiResponse, NextApiRequest} from "next"
import {Readable} from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable){
    const chunks = [];

    for await (const chunk of readable){
        chunks.push(
        typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks)
}
export const config={
    api:{
        bodyParser: false
        //api Middlewares
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export default async(req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method === "POST"){
        const buf = await buffer(req) // dados da requisiao(Headers, corpo, ...)
        const secret = req.headers['stripe-signature']//verifica se a chave STRIPESECRET bate 

        let event: Stripe.Event

        try{
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        }catch (err){
            return res.status(400).send( `Webhook error :${err.message}`);

        }

        const type = event.type

        if (relevantEvents.has(type)){
            try{
                console.log('test10')
                switch(type){
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;    

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            type === 'customer.subscription.created'
                        );

                        break;
                    case 'checkout.session.completed':  
                        const checkoutSession = event.data.object as Stripe.Checkout.Session
                        
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true)

                        break;
                    default:
                        throw new Error('Unhandled event.')
                }
            }
            catch(err){
                //sentry, bugsnag
                return res.json({error: 'Webhook handler failed.'})

            }
        }

        res.json({received: true})
    }else{
        res.setHeader('Allow', 'POST'   )
        res.status(405).end('Method not Allowed')
    }
}

