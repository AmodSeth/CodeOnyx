import React from 'react'
import Avatar from 'react-avatar'

function Client({username}) {
  return (
    <div className='Client'>
       <Avatar name={username} size={50} round="14px" color='#ff6699' />
        <span className='username'>
            {username}
        </span>




    </div>
  )
}

export default Client