import axios from "axios";
import { useEffect, useState } from "react"
import Block from "./Block";

export default function Blocks() {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        const getBlocks = async() => {
            try {
                const { data } = await axios.get(`blocks`)
                setBlocks(data)
            } catch (error) {
                console.log(error)
            }
        }
        getBlocks()
    }, [])

    return (
        <div>
            <h3>Blocks</h3>
            {
                blocks.map(block => (
                    <Block key={block.timestamp} block={block}/>
                ))
            }
        </div>
    )
}
