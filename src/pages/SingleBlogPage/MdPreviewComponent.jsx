import React from 'react'
import markdownIt from 'markdown-it'
const MdPreviewComponent = ({data}) => {
    const md = markdownIt()
  return (
    <>
         <article className='prose  !max-w-[100%]  !text-white text-lg py-10' dangerouslySetInnerHTML={{__html:md.render(data)}} />
    </>
  )
}

export default MdPreviewComponent