'use client'
import { getUserByEmail, updateUser } from "@/db/service"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ConfirmPage = () => {
    let searchParams = useSearchParams()
    let email = searchParams.get('email')
    const [user, setUser] = useState()
    useEffect(() => {
        async function getData() {
            let response = await getUserByEmail(email)
            if(response) {
                await updateUser(response.docId, {
                    active: true
                })
            }
            setUser(response)
        }
        getData()
    }, [])

    return (
        <div className="h-[100vh] p-7 w-full bg-[#0d0d0d]">
            <p className="text-[32px] text-orange-400 font-bold mb-3">Verificação de Email</p>
            {
                user ? (
                    <div className="rounded-[10px] w-full bg-orange-400 p-4">
                        <p className="text-black font-bold">Sua conta foi confirmada!</p> Já pode retornar ao aplicativo
                    </div>
                ) : (
                    <div className="rounded-[10px] w-full bg-orange-400 p-4">
                        <p className="text-black font-bold">Conta não encontrada</p> Refaça o processo de verificação e solicite um novo email
                    </div>
                )
            }
        </div>
    )
}

export default ConfirmPage