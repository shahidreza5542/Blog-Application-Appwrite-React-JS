import React, { useState } from 'react'
import AddComment from './AddComment'
import AllComments from './AllComments'

const CommentSection = ({id}) => {

  const [isUpdate,setIsUpdate] = useState(false)

  return (
    <>
        <AddComment {...{isUpdate,setIsUpdate,id}} />
        <AllComments {...{isUpdate,setIsUpdate,id}} />
    </>
  )
}

export default CommentSection