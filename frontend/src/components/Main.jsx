import { useEffect, useState } from "react"
import axios from 'axios'
import Blocks from "./Blocks";

export default function Main() {
    const [walletInfo, setWalletInfo] = useState({});
    const { address, balance } = walletInfo;

    useEffect(() => {
        const getWalletInfo = async() => {
            try {
                const { data } = await axios.get(`wallet-info`)
                setWalletInfo(data)
            } catch (error) {
                console.log(error)
            }
        }
        getWalletInfo()
    }, [])

    return (
        <>
            <div className="walletInfo">
                <div className="">Address: {address}</div>
                <div className="">Balance: {balance}</div>
            </div>
            <br />
            <Blocks />
        </>
    )
}
