import Head from 'next/head'
import Image from 'next/image'


export default function Message () {
  return (
    <>
      <Head>
        <title> Message </title>
      </Head>

     <div>
        Message
     </div>

    </>
  )
}

export async function getServerSideProps ({req,res}) {
  let tokenReq= {}
  let userData ={}
  if(req.cookies.token){
      tokenReq=JSON.parse(req.cookies.token)     
  } else {
    return {
      redirect:{
        permanent:false,
        destination:"/"
      }
    }
  }

  return {
      props: {
        token: tokenReq 
      }
  }
}
