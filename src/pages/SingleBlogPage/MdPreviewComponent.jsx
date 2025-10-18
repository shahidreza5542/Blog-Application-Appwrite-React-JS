import React, { useMemo } from 'react'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const MdPreviewComponent = ({ data }) => {
  const md = useMemo(() => {
    return markdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs rounded-lg overflow-x-auto p-4"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
          } catch (__) { }
        }
        return `<pre class="hljs rounded-lg overflow-x-auto p-4"><code>${md.utils.escapeHtml(str)}</code></pre>`
      },
    })
  }, [])

  return (
    <article
      className="prose !max-w-[100%] text-lg py-10 font-sans leading-relaxed tracking-wide"
      style={{ color: 'var(--color-text)' }}
      dangerouslySetInnerHTML={{ __html: md.render(data) }}
    />

  )
}

export default MdPreviewComponent
