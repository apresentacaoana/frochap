import { GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup, updatePassword } from "firebase/auth";
import { useContext } from "react";

import { addDoc, collection, query, getDocs, where, getDoc, updateDoc, doc, orderBy, deleteDoc, arrayUnion } from 'firebase/firestore'
import {auth, db} from '../firebase'

const googleProvider = new GoogleAuthProvider()


const loginComEmailESenha = async (email, senha, setAlert, navigation) => {
    
    try {
        let responseUser = getUserByEmail(email)
        if(!responseUser) return setAlert("Usuário não encontrado")
        if(responseUser.senha != senha) return setAlert("Senha incorreta")
        navigation.replace("home")
    } catch (e) {
        console.log(e)
    }

    
}

const registrarComEmailESenha = async({nome, email, senha, lat, long, role = "normal", cpf, genero}, navigation) => {


    try {
        await addDoc(collection(db, "users"), {
            nome,
            senha,
            email,
            lat,
            long,
            role,
            cpf,
            genero,
            plan: "",
            subscription_date: "",
            litros: 100,
            bonus: 0,
            posto: {}
        })
        navigation.replace("login")
    } catch(e) {console.log(e)}
}

const recuperarSenha = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email)
    } catch(e) {console.log(e)}
}

const logout = () => {
    signOut(auth)
}

const entrarComGoogle = async (lat, long, role = "normal") => {
    try {
        const res = await signInWithPopup(auth, googleProvider)
        const user = res.user
        const q = query(collection(db, "users"), where("uid", "==", user.uid))
        const docs = await getDocs(q)
        if(docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                nome: user.displayName,
                email: user.email,
                lat,
                long,
                role,
                plan: "",
                subscription_date: "",
                litros: 100,
                bonus: 0
            })
        }
    } catch(e) {}
}

const getUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, "users")
        const docs = await getDocs(query(usersRef, where("id", "==", email)))
        let response;
        docs.forEach((doc) => {
            if(doc.data().id == email) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const updateUser = async (docId, data) => {
    try {
        await updateDoc(doc(db, "users", docId), {
            ...data
        })
    } catch(e) {console.log(e)}
}

const updateVenda = async (docId, data) => {
    try {
        await updateDoc(doc(db, "vendas", docId), {
            ...data
        })
    } catch(e) {console.log(e)}
}

const novaVenda = async (id, {posto, comprador, vendedor, gasolina, valor, litros, status = "pendente"}) => {
    try {
        const vendaRef = collection(db, "vendas")
        await addDoc(vendaRef, {
            id,
            posto,
            comprador,
            vendedor,
            gasolina,
            valor,
            litros,
            status,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getVendas = async () => {
    try {
        let vendaRef = collection(db, "vendas")
        let q = query(vendaRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        }) 
        return response
    } catch(e) {console.log(e)}
}

const getVendasById = async (id) => {
    try {
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, where("id", "==", id))
        let vendas = await getDocs(q)
        let response = {}
        vendas.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getPlanoById = async (id) => {
    try {
        let planosRef = collection(db, "planos")
        let q = query(planosRef, where("id", "==", id))
        let planos = await getDocs(q)
        let response = {}
        planos.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getVendasByCompradorId = async (email) => {
    try {
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, where("comprador.email", "==", email))
        let vendas = await getDocs(q)
        let response = {}
        vendas.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getVendasByVendedorId = async (email) => {
    try {
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, where("vendedor.email", "==", email))
        let vendas = await getDocs(q)
        let response = {}
        vendas.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const novoBonus = async (id, litros, dias, motivo, genero) => {
    try {
        let bonusRef = collection(db, "bonus")
        await addDoc(bonusRef, {
            id,
            litros,
            dias,
            motivo,
            genero,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getAllBonus = async () => {
    try {
        let bonusRef = collection(db, "bonus")
        let q = query(bonusRef, orderBy("createdAt", "asc"))
        let docs = await getDocs(q)
        let response = []
        docs.forEach((doc) => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const getBonusById = async (id) => {
    try {
        let bonusRef = collection(db, "bonus")
        let q = query(bonusRef, where("id", "==", id))
        let bonus = await getDocs(q)
        let response = {}
        bonus.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const updateBonus = async (docId, data) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const deleteBonus = async (docId) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const novoPosto = async ({nome, logo, combustiveis, descricao, frentistas = [], endereco, bairro, cidade, estado, cep, lat, lng}) => {
    try {
        let postosRef = collection(db, "postos")
        await addDoc(postosRef, {
            nome,
            combustiveis,
            descricao,
            frentistas,
            endereco,
            bairro,
            cidade,
            estado,
            cep,
            logo,
            lat,
            lng,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getPostos = async () => {
    try {
        let postosRef = collection(db, "postos")
        let q = query(postosRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const updatePosto = async (docId, data) => {
    try {
        let docRef = doc(db, "postos", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const excluirPosto = async (docId) => {
    try {
        let docRef = doc(db, "postos", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const novoPlano = async ({id, nome, descricao, price, days}) => {
    try {
        let planosRef = collection(db, "planos")
        await addDoc(planosRef, {
            id,
            nome,
            descricao,
            price,
            days,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getPlanos = async () => {
    try {
        let planosRef = collection(db, "planos")
        let q = query(planosRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const updatePlano = async (docId, data) => {
    try {
        let docRef = doc(db, "planos", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const excluirPlano = async (docId) => {
    try {
        let docRef = doc(db, "planos", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const excluirBonus = async (docId) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const novoRequest = async ({user, posto}) => {
    try {
        let requestRef = collection(db, "requests")
        await addDoc(requestRef, {
            user,
            posto,
            createdAt: new Date()
        })

    } catch(e) {console.log(e)}
}

const getRequests = async () => {
    try {
        let requestRef = collection(db, "requests")
        let q = query(requestRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const excluirRequest = async (docId) => {
    try {
        let docRef = doc(db, "requests", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const aceitarRequest = async (docId) => {
    try {
        let data = await getDoc(doc(db, "requests", docId))
        if(data.exists()) {
            let dados = data.data()
            let frentista = {[dados.user.email]: {
                ...dados.user
            }}
            await updateUser(dados.user.docId, {
                posto: dados.posto
            })
            await updatePosto(dados.posto.docId, {
                frentistas: arrayUnion(frentista)
            })
            await excluirRequest(docId)
        }

    } catch(e) {console.log(e)}
}

export {logout, getPlanoById, entrarComGoogle, excluirBonus, updateVenda, updatePosto, getVendas, getVendasByCompradorId, getAllBonus, novoBonus, getVendasById, getVendasByVendedorId, aceitarRequest, updatePlano, updateBonus, excluirRequest, getRequests, novoRequest, deleteBonus, excluirPlano, novoPlano, getPlanos, excluirPosto, getPostos, novoPosto, getBonusById,  novaVenda, updateUser, getUserByEmail, loginComEmailESenha, recuperarSenha, registrarComEmailESenha}