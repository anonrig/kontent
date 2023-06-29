import yaml from 'yaml'

import remarkExtractFrontmatter from 'remark-extract-frontmatter'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import { CompileOptions } from '@mdx-js/mdx'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode, { CharsElement, LineElement } from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

export const options: CompileOptions = {
  remarkPlugins: [
    remarkParse,
    remarkFrontmatter,
    [
      remarkExtractFrontmatter,
      {
        yaml: yaml.parse,
        name: 'meta',
        remove: true,
      },
    ],
    remarkGfm,
    [remarkRehype, { allowDangerousHtml: true }],
  ],
  rehypePlugins: [
    rehypeRaw,
    rehypeStringify,
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: 'one-dark-pro',
        keepBackground: false,
        onVisitLine(node: LineElement) {
          // Prevent lines from collapsing in `display: grid` mode, and allow empty
          // lines to be copy/pasted
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }]
          }
        },
        onVisitHighlightedLine(node: LineElement) {
          node.properties.className ??= []
          node.properties.className.push('line--highlighted')
        },
        onVisitHighlightedChars(node: CharsElement) {
          node.properties.className ??= []
          node.properties.className.push('word--highlighted')
        },
      },
    ],
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ['anchor'],
        },
      },
    ],
  ],
}
