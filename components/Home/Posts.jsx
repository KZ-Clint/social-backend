import Loadmorebtn from '../Loadmorebtn';
import Postcard from './Postcard';


export default function Posts ({posts, loggeduser, setLoggedUser, setPosts, setEditPost, token, handleLoadMore, result, page}) {


  return (
    <>    
       <div className="posts" > 
          {
             posts.map( (post) => ( 
                <Postcard key={post._id} posts={posts} loggeduser={loggeduser} setLoggedUser={setLoggedUser} setPosts={setPosts} setEditPost={setEditPost} token={token} post={post} />
              ) )
          }  
       </div> 
       <Loadmorebtn handleLoadMore={handleLoadMore} result={result} page={page} />
    </>
  )
}
