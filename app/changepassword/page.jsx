"use client"
import { getUserByEmail, updateUser } from "@/db/service"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ChangePassword = () => {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [user, setUser] = useState({})
    const [password, setPassword] = useState("")
    const [alerta, setAlerta] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        async function getData() {
            let response = await getUserByEmail(email)
            setUser(response)
        }
        getData()
    }, [])
    const handleSubmit = async () => {
        setAlerta("")
        if(!password || !newPassword) return setAlerta("Preencha todos os campos")
        if(password != newPassword) return setAlerta("As senhas precisam ser iguais")
        setAlerta("Pronto! A senha da conta acaba de ser alterada")
        await updateUser(user.docId, {
    
            senha: password

        })
    }
    return (
        <div className="h-[100vh] p-7 w-full bg-white">
            <p className="text-[32px] text-blacj font-bold mb-3">Redefinir senha</p>
            {alerta && (
                <div className="rounded-[10px] mb-3 w-full bg-black p-4">
                    <p className="text-white font-bold">{alerta}</p>
                </div>
            )}
            <div className="mb-[12px] text-black">
                <p className="text-[16px] text-black font-normal my-[8px]">
                    Nova senha
                </p>
                <div className="w-full h-[48px] flex border border-black rounded-[8px] items-center justify-center pl-[22px]">
                    <input 
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-black outline-none bg-transparent"
                    />
                </div>
            </div>
            <div className="mb-[32px] text-black">
                <p className="text-[16px] text-black font-normal my-[8px]">
                    Repetir nova senha
                </p>
                <div className="w-full h-[48px] flex border border-black rounded-[8px] items-center justify-center pl-[22px]">
                    <input 
                        value={newPassword}
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-black outline-none bg-transparent"
                    />
                </div>
            </div>
            <div onClick={handleSubmit} className="text-white hover:bg-gray-900 bg-black rounded-[10px] p-4 text-center">
                <p className="text-center">Confirmar</p>
            </div>
        </div>
    )
}

export default ChangePassword