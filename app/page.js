'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Payment, StatusScreen, initMercadoPago } from '@mercadopago/sdk-react'
import { useEffect, useState } from 'react';
import { processOrder } from './actions/mp';
import { getPlanoById, getUserByEmail, updateUser } from '@/db/service';
import moment from 'moment/moment';
initMercadoPago('TEST-96b59b6b-afd0-4226-9dae-1edda2c65253', {locale: "pt-BR"});


export default function Home() {
  let searchParams = useSearchParams()
  let planoId = searchParams.get('planoId')
  let userId = searchParams.get('userId')
  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState(null)
  const [plano, setPlano] = useState({})
  const [user, setUser] = useState({})
  const router = useRouter()

  


  useEffect(() => {
    async function getData() {
      const responseUser = await getUserByEmail(userId)
      const responsePlano = await getPlanoById(planoId)
      setUser(responseUser)
      setPlano(responsePlano)

      console.log(responsePlano)

      const resposta = await fetch('/api/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: responsePlano.id,
          nome: responsePlano.nome,
          preco: Number(responsePlano.price)
        }),
      });

      
      if(!resposta.ok) {
        return console.log("Erro ao processar pedido")
      }

      const resultado = await resposta.json();
      setOrder(resultado)


      setLoading(false)


    }

    getData()
  }, [])

  const initialization = {
    amount: Number(plano.price),
    preferenceId: order.id
  }

  const customization = {
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
    },
  }


  const onSubmit = async (
    DATA
  ) => {
    const response = await fetch("/api/pagamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(DATA),
    })
    if(response.ok) {
      let data = await response.json()
      if(data.status == 'approved') {
        await updateUser(user.docId, {
          plan: plano,
          subscription_date: moment(new Date()).format("DD/MM/YYYY"),
          litros: user.litros + Number(plano.litros.replace(',', '.'))
        })
      }
      router.push(`/result/${data.id}`)
    }
   };


  return (
    <>
    
    {loading ? (
      <p className='absolute font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        Carregando
      </p>
    ) : 
    
      (
        <>
          <Payment
              initialization={initialization}
              customization={customization}
              onSubmit={onSubmit}
          />
        </>
      )
      
    }

    </>
  )
}
