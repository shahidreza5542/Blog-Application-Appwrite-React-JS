import React, { useMemo } from 'react'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // 👈 Code syntax theme (dark)
import 'github-markdown-css/github-markdown-dark.css' // Optional markdown base styling

const MdPreviewComponent = ({ data }) => {
  // Configure markdown-it with highlight.js
  const md = useMemo(() => {
    return markdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs rounded-lg overflow-x-auto p-4"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
          } catch (__) {}
        }
        return `<pre class="hljs rounded-lg overflow-x-auto p-4"><code>${md.utils.escapeHtml(str)}</code></pre>`
      },
    })
  }, [])

  return (
    <article
      className="prose prose-invert !max-w-[100%] text-text text-lg py-10
        prose-code:text-white prose-code:px-2 prose-code:py-1 prose-code:rounded
        prose-pre:bg-gray-800 prose-pre:text-text prose-pre:border prose-pre:border-gray-700
        prose-strong:text-text prose-em:text-text prose-headings:text-text
        prose-blockquote:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-l-btn prose-blockquote:pl-4
        prose-a:text-btn prose-a:no-underline hover:prose-a:underline
        font-sans leading-relaxed tracking-wide"
      dangerouslySetInnerHTML={{ __html: md.render(data) }}
    />
  )
}

export default MdPreviewComponent
