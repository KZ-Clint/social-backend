import { useState, useEffect, useContext } from 'react'


export default function Toast ({msg, handleShow, bgColor}) {

  return (
    <>
       <div className={`toast show position-fixed text-light ${bgColor}`}
        style={{ top: "5px", right:"5px", minWidth:"200px", zIndex: 50 }} > 
           <div className={`toast-header text-light ${bgColor}`} >
               <strong className="mr-auto text-light" > {msg.title} </strong>
               <button className="ml-2 mb-1 close text-light" 
                data-dismiss="toast" style={{outline: "none"}} onClick={handleShow} >
                &times; </button>
           </div>
           <div className="toast-body" >
               <strong> {msg.body} </strong>
           </div>
        </div> 
    </>
  )
}

