import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Context } from '@/components/Context'
import baseUrl from '@/components/baseUrl/baseUrl'
import {useRouter} from 'next/router'
import { valid } from '@/components/Valid'

export default function Register () {

  const { setGenLoading, setError, setSuccess, isLoggedin, setIsLoggedIn } = useContext(Context)

  const initialState = { fullname:'', username:'', email: '', password: '', cf_password:'', gender:'male' }
  const [ userdata, setUserData ] = useState(initialState)
  const { fullname, username, email, password, cf_password, gender } = userdata
  const [typePass, setTypePass ] = useState(false)
  const [alert, setAlert ] = useState({})
  const [typeCfPass, setTypeCfPass ] = useState(false)
  const router = useRouter()

  const handleChangeInput = (e) => {
    const {name, value} = e.target
    setUserData({...userdata, [name] : value })  
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const check = valid(userdata)
    if(check.errLength > 0) {
     return setAlert(check.errMsg)
    }
     setGenLoading(true)
    try{
      const res = await axios.post( `${baseUrl}/api/user/signup`, { ...userdata, passwords:password } )
      console.log(res.data)
      setSuccess(res.data.msg)
      setGenLoading(false)
      router.push("/login")
    } catch (err) {
      console.log(err.response.data.error)
       setError(err.response.data.error)
       setGenLoading(false)
    } 
  }


  return (
    <>
      <Head>
        <title> Register </title>
      </Head>
      <div className="auth_page" > 
        <form onSubmit={handleSubmit} >
          <h3 className="text-uppercase text-center mb-4" > C-Social </h3>
              <div className="form-group">
                 <label htmlFor="fullname"> Full Name </label>
                 <input type="text" className="form-control" id="fullname" name="fullname" onChange={handleChangeInput} value={fullname} />
                 <small className="form-text text-danger" > { alert.fullname ? alert.fullname : "" } </small>
              </div>
              <div className="form-group">
                 <label htmlFor="username"> User Name </label>
                 <input type="text" className="form-control" id="username" name="username" onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')} />
                 <small className="form-text text-danger" > { alert.username ? alert.username : "" } </small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" name="email" onChange={handleChangeInput} value={email} />
                <small className="form-text text-danger" > { alert.email ? alert.email : "" } </small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <div className="pass">
                  <input type={ typePass ? "text" : "password" } className="form-control" id="exampleInputPassword1" name="password" onChange={handleChangeInput} value={password} />
                  <small onClick={ () => { setTypePass(!typePass) } } >
                        { typePass ? "Hide" : "Show" }
                  </small>
                </div>
                <small className="form-text text-danger" > { alert.password ? alert.password : "" } </small>
              </div>

              <div className="form-group">
                <label htmlFor="cf_password"> Confirm Password</label>
                <div className="pass">
                  <input type={ typeCfPass ? "text" : "password" } className="form-control" id="cf_password" name="cf_password" onChange={handleChangeInput} value={cf_password} />
                  <small onClick={ () => { setTypeCfPass(!typeCfPass) } } >
                        { typeCfPass ? "Hide" : "Show" }
                  </small>
                </div>
                <small className="form-text text-danger" > { alert.cf_password ? alert.cf_password : "" } </small>
              </div>

              <div className="row justify-content-between mx-0 mb-1" >
                   <label htmlFor='male' >
                        Male: <input type="radio" id="male" name="gender" value="male"  defaultChecked onChange={handleChangeInput}  />  
                   </label>
                   <label htmlFor='female' >
                        Female: <input type="radio" id="female" name="gender" value="female" onChange={handleChangeInput}  />  
                   </label>
              </div>

              <button type="submit" className="btn btn-dark w-100" disabled={ email && password ? false : true } > Register </button>
              <p className="my-2" > Already have an account? <Link href={`/`} style={{color:"crimson"}} > Login Now </Link> </p>
          </form>
        </div> 
    </>
  )
}

Register.getLayout = function PageLayout(page) {
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