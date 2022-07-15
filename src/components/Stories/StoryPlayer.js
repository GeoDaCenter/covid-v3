import React from 'react';
import Plyr from "plyr-react";
import {MarkdownViewer} from './MarkdownViewer';


export const StoryPlayer = ({
    story
}) => {
    if (!story?.type) {
        return null;
    }
    switch (story.type) {
        case "video": {
            const mediaUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}${story.fileType}`
            const captionUrl = `${process.env.REACT_APP_STORIES_PUBLIC_URL}/${story.id}_otter_ai.vtt`
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
            return <Plyr source={videoSrc} crossOrigin="anonymous" />
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
            return <Plyr source={audioSrc} crossOrigin="anonymous" />
        default:
            return null
    }
}



