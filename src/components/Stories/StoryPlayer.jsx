import { useState } from 'react';
import React from 'react';
import {MarkdownViewer} from './MarkdownViewer';
const Plyr = React.lazy(() => import("plyr-react"));
/**
 * Main story content renderer. Requires `process.env.REACT_APP_STORIES_PUBLIC_URL` of public CDN for stories.
 * @param {Object} props 
 * @param {StoryMeta} props.story Story content to render
 * 
 * @component
 * @category Components/Stories
 */
function StoryPlayer({
    story
}){
    let [showShort, setShowShort] = useState(true);
    if (!story?.type) {
        return null;
    }
    switch (story.type) {
        case "video": {
            const vidBaseName = story.shortPresent && showShort ? `${story.id}-short` : story.id
            const mediaUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${vidBaseName}${story.fileType}`
            const captionUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${vidBaseName}_otter_ai.vtt`
            const videoSrc = {
                type: "video",
                sources: [
                    {
                        src: mediaUrl
                    }
                ],
                tracks: [
                    {
                        kind: 'captions',
                        label: 'English',
                        srcLang: 'en',
                        src: captionUrl
                    }
                ]
            };
            return <>
                <div><Plyr source={videoSrc} crossOrigin="anonymous" /></div>
                {story.shortPresent &&
                    <button style={{color:'white', padding: '5px'}} onClick={() => {setShowShort(!showShort)}}>
                        Show {showShort ? 'full' : 'short'} video
                    </button>
                }
                </>
        }
        case "photo": {
            const photoUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}${story.fileType}`
            const captionUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}.md`
            return <>
                <img alt="user story submission" src={photoUrl} style={{ maxWidth: '100%', maxHeight: '50vh', display: 'block', margin: '0 auto' }} />
                <MarkdownViewer id={story.id} url={captionUrl} />
            </>
        }
        case "written": {
            const contentUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}${story.fileType}`
            return <MarkdownViewer id={story.id} url={contentUrl} tall />
        }
        case "audio":
        case "phone":
            const audioUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}${story.fileType}`
            // const type = story.type === "audio" ? "audio/mpeg" : "audio/wav"
            const audioSrc = {
                type: 'audio',
                sources: [
                    {
                        src: audioUrl
                    }
                ],
            };
            return <div><Plyr source={audioSrc} crossOrigin="anonymous" /></div>
        default:
            return null
    }
}

export { StoryPlayer };