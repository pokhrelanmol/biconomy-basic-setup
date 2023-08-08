import React, { useState, useEffect } from "react";
import SmartAccount from "@biconomy/smart-account";
import abi from "../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Props {
    smartAccount: SmartAccount;
    provider: any;
}
const Counter: React.FC<Props> = ({ smartAccount, provider }) => {
    const [count, setCount] = useState<number>(0);
    const [counterContract, setCounterContract] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const counterAddress = "0x077cB93A26265b23962061858Dcb60e7d8FF4652";
    useEffect(() => {
        setIsLoading(true);
        getCount(false);
    }, []);

    const getCount = async (isUpdating: boolean) => {
        console.log("calling ");
        const contract = new ethers.Contract(counterAddress, abi, provider);
        console.log({ contract });
        setCounterContract(contract);
        const currentCount = await contract.count();
        setCount(currentCount.toNumber());
        if (isUpdating) {
            toast.success("count has been updated!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };
    const incrementCount = async () => {
        try {
            toast.info("processing count on the blockchain!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            console.log({ counterContract });
            const incrementTx =
                await counterContract.populateTransaction.incrementCount();
            const tx1 = {
                to: counterAddress,
                data: incrementTx.data,
            };
            const txResponse = await smartAccount.sendTransaction({
                transaction: tx1,
            });

            const txHash = await txResponse.wait();
            console.log(txHash);
            getCount(true);
        } catch (error) {
            console.log({ error });
            toast.error("error occured check the console", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <button onClick={() => incrementCount()}>count is {count}</button>
        </>
    );
};

export default Counter;
