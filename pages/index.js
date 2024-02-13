import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/components/Context'
import baseUrl from '@/components/baseUrl/baseUrl'
import {useRouter} from 'next/router'


export default function Login () {
  
  const { setGenLoading, setError, setSuccess, isLoggedin, setIsLoggedIn } = useContext(Context)
  const initialState = {  email: '', password: '' }
  const [ userdata, setUserData ] = useState(initialState)
  const { email, password } = userdata
  const [typePass, setTypePass ] = useState(false)
  const router = useRouter()

  const handleChangeInput = (e) => {
    const {name, value} = e.target
    setUserData({...userdata, [name] : value })  
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setGenLoading(true)
    try{
      const res = await axios.post( `${baseUrl}/api/user/login`, userdata )
      console.log(res.data)
      localStorage.setItem('userData', JSON.stringify({ username:res.data.user.username, fullname:res.data.user.fullname, avatar:res.data.user.avatar }))
      localStorage.setItem('firstLogin', true)
      setSuccess(res.data.msg)
      setGenLoading(false)
      const toke =  await axios.post("/api/login",{
        token: res.data.access_token   
      }) 
      setIsLoggedIn(true)
      router.push("/")
    } catch (err) {
      console.log(err.response.data.error)
       setError(err.response.data.error)
       setGenLoading(false)
    }

  }

  return (
    <>
      <Head>
        <title> Login </title>
      </Head>
     
       <div className="auth_page" > 
       <form onSubmit={handleSubmit} >
       <h3 className="text-uppercase text-center mb-4" > C-Social </h3>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" onChange={handleChangeInput} value={email} />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <div className="pass">
               <input type={ typePass ? "text" : "password" } className="form-control" id="exampleInputPassword1" name="password" onChange={handleChangeInput} value={password} />
               <small onClick={ () => { setTypePass(!typePass) } } >
                    { typePass ? "Hide" : "Show" }
               </small>
            </div>
          </div>
          <button type="submit" className="btn btn-dark w-100" disabled={ email && password ? false : true } >Submit</button>
          <p className="my-2" > You don't have an account? <Link href={`/register`} style={{color:"crimson"}} > Register Now </Link> </p>
       </form>
        </div> 
    </>
  )
}


Login.getLayout = function PageLayout(page) {
  return (
    <>
     {page}
    </>
  )
}


export function getServerSideProps ({req,res}) {
  let tokenReq= {}
  if(req.cookies.token){
      tokenReq=JSON.parse(req.cookies.token)
      return {
        redirect:{
          permanent:false,
          destination:"/home"
        }
      }
  } 
  return {
      props: { token: tokenReq }
  }
}


