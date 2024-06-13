import * as anchor from '@project-serum/anchor'
import {useEffect, useMemo, useState} from 'react'
import {IDL} from "@/constant/idl"
import {PROGRAM_ADDRESS} from "@/constant/address";
import {SystemProgram} from '@solana/web3.js'
import {utf8} from '@project-serum/anchor/dist/cjs/utils/bytes'
import {findProgramAddressSync} from '@project-serum/anchor/dist/cjs/utils/pubkey'
import {useAnchorWallet, useConnection, useWallet} from '@solana/wallet-adapter-react'

export default function useComment() {
    const {connection} = useConnection();
    const {publicKey} = useWallet();
    const anchorWallet = useAnchorWallet();

    const [initialized, setInitialized] = useState(false)
    const [lastComment, setLastComment] = useState(0)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(IDL, PROGRAM_ADDRESS, provider)
        }
    }, [connection, anchorWallet])

    useEffect(() => {
        const findProfileAccounts = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    setLoading(true)
                    const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_ID'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.user.fetch(profilePda);
                    console.log(profilePda, profileBump);

                    if (profileAccount) {
                        // @ts-ignore
                        setLastComment(profileAccount.comments)
                        setInitialized(true)

                        const todoAccounts = await program.account.comment.all()
                        // @ts-ignore
                        setComments(todoAccounts);
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setComments([])
                } finally {
                    setLoading(false)
                }
            }
        }

        findProfileAccounts()
    }, [publicKey, program, transactionPending])

    const createUser = async (userName: string) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_ID'), publicKey.toBuffer()], program.programId)

                await program.methods
                    .createUser(userName)
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                setInitialized(true)
                console.log('Successfully initialized user.')
            } catch (e) {
                console.log(e)
            } finally {
                setTransactionPending(false)
            }
        }
    }

    const addComment = async (content: string) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_ID'), publicKey.toBuffer()], program.programId)
                const [commentPda, commentBump] = findProgramAddressSync([utf8.encode('COMMENT_ID'), publicKey.toBuffer(), Uint8Array.from([lastComment])], program.programId)

                if (content == "") {
                    setTransactionPending(false)
                    return
                }

                await program.methods
                    .writeComment(content)
                    .accounts({
                        userProfile: profilePda,
                        comment: commentPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                console.log('Successfully added todo.')
            } catch (error) {
                console.log(error)
            } finally {
                setTransactionPending(false)
            }
        }
    }

    return { initialized, createUser, loading, transactionPending, addComment, comments }
}