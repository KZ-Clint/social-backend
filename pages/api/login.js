import cookie from 'cookie'

export default ( req, res ) => {
   
    res.setHeader( "Set-Cookie", cookie.serialize("token", JSON.stringify(req.body.token), {
        httpOnly : true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 600*60,
        sameSite: "strict",
        path: "/"
    } ) )
    
    res.statusCode = 200
    res.json( { success: true } )
}