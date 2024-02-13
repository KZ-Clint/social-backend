import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import Loading from '@/components/Loading'
import Toast from '@/components/Toast'


export default function Notify () {

    const { genloading, error, success, setError, setSuccess } = useContext(Context)
    const handleShow = () => {
       setSuccess(null)
       setError(null)
    }

  return (
    <>
       <div> 
           { genloading && <Loading/> }
           { error && <Toast msg={{title:"Error", body:error }} handleShow={handleShow} bgColor={"bg-danger"} />  }
           { success && <Toast msg={{title:"Success", body:success }} handleShow={handleShow} bgColor={"bg-success"}  />  }
        </div> 
    </>
  )
}

