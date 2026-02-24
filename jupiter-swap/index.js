import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { VersionedTransaction } from '@solana/web3.js';
import { Keypair } from "@solana/web3.js";


const app=express();
app.use(cors());
app.use(express.json());


app.post('/jupiterOrder', async (req,res)=>{
  const {amount,publicKey}=req.body
  const exactAmount=parseFloat(amount)
  console.log(exactAmount);
  console.log(publicKey);
   const orderResponse = await (
  await fetch(
    'https://api.jup.ag/ultra/v1/order' +
    '?inputMint=So11111111111111111111111111111111111111112' +
    '&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' +
   `&amount=${exactAmount*1000000000}` +
    `&taker=${publicKey}`,
    {
      headers: {
        'x-api-key': process.env.JUPITER_API_KEY,
      },
    }
  )
).json();

if(orderResponse.error){
  console.log(orderResponse.error);
  return res.status(400).json(orderResponse)
}

res.status(200).json(orderResponse)

})

app.post('/execute', async(req,res)=>{
  const{signedTransaction, requestId}=req.body;
  console.log(signedTransaction);
  const executeResponse = await (
    await fetch('https://api.jup.ag/ultra/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.JUPITER_API_KEY,
        },
        body: JSON.stringify({
            signedTransaction: signedTransaction,
            requestId: requestId,
        }),
    })
).json();

if(executeResponse.status==="Success"){
  res.status(200).json({
    message:"swap successful"
  })
}else{
  return res.status(400).json({
    messsage:"swap not successful"
  })
}

})

app.listen(3000, ()=>{
    console.log("the app is listeneing to port 3000");
})


