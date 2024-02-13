import { ContextProvider } from '@/components/Context'
import '@/styles/globals.css'
import '@/styles/Signin.css'
import '@/styles/Notify.css'
import '@/styles/Loading.css'
import '@/styles/Header.css'
import '@/styles/Profile.css'
import '@/styles/Home.css'
import '@/styles/Statusmodal.css'
import '@/styles/Comment.css'
import '@/styles/Postthumb.css'

import Notify from '@/components/Notify'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Statusmodal from '@/components/Home/Statusmodal'
import Socketclient from '@/components/Home/Socketclient'

export default function App({ Component, pageProps }) {

  if(Component.getLayout) {
    return Component.getLayout(
      <ContextProvider>
        <Socketclient/>
        <Layout>
         {/* <Statusmodal/>  */}
         <Notify/>
         <Component {...pageProps} />
        </Layout>
      </ContextProvider>
      )
  }


  return (
    <>
    <ContextProvider>
       <Layout>
         {/* <Statusmodal/> */}
         <Socketclient />
         <Header/>
         <Notify/>
         <Component {...pageProps} />
      </Layout>
    </ContextProvider>   
    </>
  )
}
