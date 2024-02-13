import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import Loading from '@/components/Loading'
import {useRouter} from 'next/router'
import Avatar from '@/components/Header/Avatar'
import Search from '@/components/Header/Search'
import axios from 'axios'

export default function Header () {

    const {  isloggedin, removeCookie, theme, setTheme } = useContext(Context)
    const router = useRouter()
    const { pathname } = router
    const [ user, setUser ] = useState({})
    const [ token, setToken ] = useState(null)
   
    const navLinks = [
        { label:'Home', icon: 'home', path: '/home' },
        { label:'Message', icon: 'near_me', path: '/message' },
        { label:'Discover', icon: 'explore', path: '/discover' },
        { label:'Notify', icon: 'favorite', path: '/notify' }
    ]
    const isActive = (pn) => {
        if(pn === pathname ) return 'active'
    }
    
    useEffect(() => {
        const getToken =  async() => {
            const token =  await axios.get("/api/getuser")  
             setToken(token.data)
        }
        getToken()
       }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') )
        setUser( userData )
       }, []);
   
  return (
    <>
    {  isloggedin && 
       <div className="header bg-light" > 
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
                <Link href={`/`} className="logo" > 
                  <h1 className="navbar-brand text-uppercase p-0 m-0" 
                  onClick={ () => window.scrollTo({top:0}) }> 
                    C-SOCIAL 
                  </h1> 
                </Link>
                <Search token={token} /> 
                <div className="menu">
                    <ul className="navbar-nav flex-row">
                        {
                            navLinks.map( (link, index) => (
                            <li className={`nav-item px-2 ${isActive(link.path)}`} key={link.label} >
                                <Link className="nav-link" href={`${link.path}`}>
                                    <span className="material-icons"> {link.icon} </span>
                                </Link>
                            </li>
                            ) )
                        }
                        <li className="nav-item dropdown" style={{opacity:1}} >
                            <span className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-expanded="false">
                                { Object.keys(user).length > 0 && <Avatar user={user} size={"medium-avatar"} /> }
                            </span>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown" >
                            { Object.keys(user).length > 0 && <Link className="dropdown-item" href={`/profile/${user.username}`}> Profile </Link> }
                                <label htmlFor='theme' className="dropdown-item" onClick={ () => { setTheme(!theme) } } >
                                    { theme ? 'Light mode' : 'Dark mode' } </label>
                                <div className="dropdown-divider"></div>
                                <p className="dropdown-item"  onClick={removeCookie} > Logout </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
       </div> }
        
    </>
  )
}

