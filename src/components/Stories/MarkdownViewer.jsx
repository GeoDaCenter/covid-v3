import React from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const WrittenContainer = styled.div`
    max-height: ${({ tall }) => (tall ? '50vh' : '20vh')};
    padding: 0.5rem;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 0.5rem;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #2b2b2b77;
        border: 1px solid #999;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #999;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
        transition: 125ms all;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #f9f9f9;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
    }
`

/**
 * Markdown renderer for story content
 *
 * @category Components/Stories
 * @param {Object} props
 * @param {string} props.content Markdown content, if not using remote URL
 * @param {string} props.url Remote URL of markdown content
 * @param {string} props.id ID of story
 * @param {boolean} props.tall Whether to show the full height of the container
 * @component
 */
export const MarkdownViewer = ({
    content = '',
    url = '',
    id,
    tall = false,
}) => {
    const fetcher = url
        ? () =>
              fetch(url)
                  .then((res) => res.text())
                  .then((text) => text.replaceAll('<br>', '\n &nbsp;'))
        : () => Promise.resolve(content)
    const { data: text } = useSWR(id, fetcher)
    return (
        <WrittenContainer tall={tall}>
            {!!text && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {text}
                </ReactMarkdown>
            )}
        </WrittenContainer>
    )
}
