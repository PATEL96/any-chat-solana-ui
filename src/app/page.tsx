'use client'
import dynamic from 'next/dynamic'
import useComment from "@/hooks/useComment";

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    {ssr: false} // This ensures the component is not server-side rendered
);
import {useState} from "react";

export default function Home() {

    const [input, setInput] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const {initialized, createUser, loading, transactionPending, addComment, comments} = useComment();

    const handleChange = (event: any) => {
        setInput(event.target.value);
    }

    const handleUserName = (event: any) => {
        setUserName(event.target.value);
    }

    return (
        <div className="p-[1rem]">
            <div className="flex align-middle justify-between">
                {initialized ? (
                    <div className="w-[60%]">
                        <div className="w-[100%] flex align-middle justify-start">
                            <div>
                                <input
                                    className="w-[400px] bg-gray-700 h-[45px] border-0 rounded-md px-[10px] text-lg font-semibold"
                                    value={input} onChange={handleChange} type="text"
                                    placeholder="What's On your Mind"/>
                            </div>
                            <div className="w-[100px] flex align-middle justify-between px-3">
                                <button onClick={() => addComment(input)}
                                        className="w-full bg-gray-700 rounded-md hover:bg-gray-400 hover:text-black">Send
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-[60%]">
                        <div className="w-[100%] flex align-middle justify-between">
                            <div>
                                <input
                                    className="w-[400px] bg-gray-700 h-[45px] border-0 rounded-md px-[10px] text-lg font-semibold"
                                    value={userName} onChange={handleUserName} type="text"
                                    placeholder="Enter User Name..."/>
                            </div>
                            <div className="flex align-middle justify-between px-3">
                                <button onClick={() => createUser(userName)}
                                        className="px-3 w-full bg-gray-700 rounded-md hover:bg-gray-400 hover:text-black">
                                    Create User
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <WalletMultiButton/>
            </div>
            <div>
                {
                    comments.map((data: any) => (
                            <div key={data.account}
                                 className="bg-gray-600 text-xl w-max rounded-full flex align-middle justify-center px-3 mt-2">
                                {data.account.data}
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}
