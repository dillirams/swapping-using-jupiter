import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import { useState } from "react";
import { VersionedTransaction } from '@solana/web3.js';

export function SwapJupiter(){
    const[amount, setAmount]=useState("")
  
    const wallet=useWallet();
    const {connection}=useConnection();
    async function jupiterOrder() {
        const res=await axios.post("http://localhost:3000/jupiterOrder",{
            amount:amount,
            publicKey:wallet.publicKey
        })
        console.log(res.data.requestId);
        const requestId=res.data.requestId
        const transaction1=res.data.transaction;
        if(transaction1!=''){
            const transactionBase64 = transaction1;
            const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
            if(!wallet.signTransaction)throw new Error("no wallet.signTransaction") 
            const signedTx=await wallet.signTransaction(transaction)
            const signedTransaction = Buffer.from(signedTx.serialize()).toString('base64');
            console.log("the signed transaction is ");
            console.log(signedTransaction);

            const res=await axios.post('http://localhost:3000/execute',{
                signedTransaction,
                requestId
            })
            alert(res.data.message)
        }
    }

    return <div>
        <label htmlFor="">enter sol</label>
        <input onChange={(e)=>{setAmount(e.target.value)}} type="text" placeholder="" />
   
        <div>
            <button onClick={jupiterOrder}>Swap</button>
        </div>
    </div>
}