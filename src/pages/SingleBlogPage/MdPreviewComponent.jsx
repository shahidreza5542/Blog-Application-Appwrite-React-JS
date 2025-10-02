import React from 'react'
import markdownIt from 'markdown-it'
const MdPreviewComponent = ({data}) => {
    const md = markdownIt()
  return (
    <>
         <article className='prose prose-invert !max-w-[100%] !text-white text-lg py-10 
                          prose-code:bg-gray-800 prose-code:text-white prose-code:px-2 prose-code:py-1 prose-code:rounded
                          prose-pre:bg-gray-900 prose-pre:text-white prose-pre:border prose-pre:border-gray-700
                          prose-strong:text-white prose-em:text-white prose-headings:text-white
                          prose-blockquote:text-gray-300 prose-blockquote:border-l-btn
                          prose-a:text-btn prose-a:no-underline hover:prose-a:underline' 
                  dangerouslySetInnerHTML={{__html:md.render(data)}} />
    </>
  )
}

export default MdPreviewComponent