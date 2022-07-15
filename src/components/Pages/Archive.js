import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { NavBar, Footer, ContentContainer, Icon } from '../../components';
import useSWR from 'swr';
import { Box } from '@mui/system';
import { Button, Grid, Modal, Typography } from '@mui/material';
import colors from '../../config/colors';
import Plyr from "plyr-react";
import { findCounty } from '../../utils';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ArchivePage = styled.div`
  background: white;
`;

const doFilter = (story, filter) => {
    return filter.every(({ property, value, operation }) => {
        const storyValue = story[property];
        if (operation === 'match') {
            return storyValue === value;
        } else if (operation === 'contains') {
            return storyValue.includes(value);
        } else if (operation === 'not') {
            return storyValue !== value;
        } else {
            return false;
        }
    })
}

const getCounts = (stories) => {
    let counts = {
        theme: {},
        tags: {},
        state: {},
        urbanicity: {},
        type: {},
        county: {}
    }
    if (!stories) return counts;
    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const {
            state,
            county,
            theme,
            tags,
            urbanicity,
            type
        } = story;
        theme && (counts.theme[theme] = (counts.theme[theme] || 0) + 1);
        state && (counts.state[state] = (counts.state[state] || 0) + 1)
        urbanicity && (counts.urbanicity[urbanicity] = (counts.urbanicity[urbanicity] || 0) + 1);
        type && (counts.type[type] = (counts.type[type] || 0) + 1);
        county && (counts.county[county] = (counts.county[county] || 0) + 1);
        if (tags) {
            for (let j = 0; j < story.tags.length; j++) {
                const tag = story.tags[j];
                counts.tags[tag] = (counts.tags[tag] || 0) + 1;
            }
        }
    }
    return counts
}

const useStories = ({
    selectedStory = {},
    filters = [],
    singleStoryId = ''
}) => {
    const { data: allStories, error } = useSWR(
        `${process.env.REACT_APP_STORIES_PUBLIC_URL}/index.json`,
        (url) => fetch(url)
            .then(r => r.json())
            .then(rows => rows.map(row =>
                ({ ...row, ...findCounty(row.fips) })
            ))
    );
    // based on filters, return relevant stories
    // filter schema is:
    // { 
    //   property: 'county'
    //   value: 'county name'
    //   operation: 'match'
    // }
    const {
        counts,
        stories
    } = useMemo(() => {
        if (error) {
            return {
                counts: {},
                stories: []
            }
        }
        if (!allStories) {
            return {
                counts: {},
                stories: []
            }
        }
        if (!filters.length) {
            return {
                counts: getCounts(allStories),
                stories: allStories
            }
        }

        const stories = allStories.filter(story => doFilter(story, filters));
        const counts = getCounts(stories);

        return {
            counts,
            stories
        }
    }, [JSON.stringify(filters), allStories?.length])

    // filter for any related stories to display
    // match criteria include county, theme, and tags
    // returns a sorted list of stories with most matching criteria first
    const relatedStories = useMemo(() => {
        if (error) {
            return [];
        }
        if (!allStories) {
            return [];
        }
        if (!selectedStory.id) {
            return [];
        }
        const tags = selectedStory.tags;
        const county = selectedStory.county;
        const theme = selectedStory.theme;
        const state = selectedStory.county.split(',').slice(-1)[0];
        return allStories.map(story => {
            if (story.id === selectedStory.id) {
                return false;
            }
            let matchCriteria = 0;
            if (story.theme === theme) matchCriteria++;
            if (story.county === county) matchCriteria++;
            if (story.county.includes(state)) matchCriteria++;
            story.tags.forEach(tag => tags.includes(tag) && matchCriteria++);
            return matchCriteria && {
                ...story,
                matchCriteria
            }
        }).filter(story => story).sort((a, b) => b.matchCriteria - a.matchCriteria)
    }, [JSON.stringify(selectedStory), allStories?.length]);

    return {
        stories,
        counts,
        relatedStories
    }
}

const RowTitle = styled.p`
    font-size:1rem !important;
`
const RowBody = styled.p`
    font-size:.75rem !important;
`

const IconContainer = styled.div`
    max-width: 2rem;
`

const StoryCard = ({
    story,
    setActiveStory
}) => {
    const {
        theme,
        county,
        tags,
        type,
        title,
    } = story;

    const entryTitle = title?.length ? title : `A ${type} story`
    return <Grid container sx={{ width: '100%', m: 1, mb: 2 }}>
        <Grid item sm={3} md={1} sx={{ px: 2 }} alignItems="center">
            <IconContainer>
                <Icon symbol={type} style={{ maxWidth: '1rem' }} />
            </IconContainer>
        </Grid>
        <Grid item sm={9} md={3}>
            <RowTitle>{entryTitle}</RowTitle>
            <RowBody>in {county}</RowBody>
        </Grid>
        <Grid item sm={4} md={3}>
            <RowTitle>Theme</RowTitle>
            <RowBody>{theme}</RowBody>
        </Grid>
        <Grid item sm={4} md={3}>
            <RowTitle>Tags</RowTitle>
            <RowBody>{tags.map(t => `#${t}`).join(', ')}</RowBody>
        </Grid>
        <Grid item sm={4} md={2}>
            <Button onClick={() => setActiveStory(story)} variant="contained" sx={{ color: colors.darkgray, textTransform: 'none' }}>
                View
            </Button>
        </Grid>
    </Grid>
}

const FilterRow = ({
    property,
    value,
    count,
    handleFilter,
    filters
}) => {
    const isFiltered = !!filters.find(f => f.property === property && f.value === value);

    return <Button
        onClick={() => handleFilter({ property, value })}
        sx={
            isFiltered ? {
                color: 'black',
                px: .5,
                py: .25,
                my: .25,
                textTransform: 'none',
                width: '100%',
                justifyContent: "space-between",
                background: colors.skyblue
            } : {
                color: 'black',
                px: .5,
                py: .25,
                my: .25,
                textTransform: 'none',
                width: '100%',
                justifyContent: "space-between"
            }}
    >
        <Box>
            {value}
            {isFiltered && <span style={{ marginLeft: '.5rem', fontWeight: 'bold' }}>&times;</span>}
        </Box>
        <Box>
            {count}
        </Box>
    </Button>
}
const sortByValue = ([_a,a], [_b,b]) => b - a;

const FilterSection = ({
    title,
    counts,
    handleFilter,
    filters
}) => {
    return <Box sx={{ pb: 4 }}>
        <Typography sx={{ textTransform: 'capitalize' }} variant="h6">{title}</Typography>
        <hr />
        {Object.entries(counts).sort(sortByValue).map(([value, count], i) => (
            <FilterRow
                key={i}
                property={title}
                count={count}
                value={value}
                handleFilter={handleFilter}
                filters={filters}
            />
        ))}
    </Box>

}
const containsProperties = ["tags", "state"]
const SidebarContainer = styled(Grid)`
    /* max-height: 80vh;
    overflow-y:auto;
    margin-top:1em;
    padding-right:1em;
    
    ::-webkit-scrollbar {
            width: .5rem;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #eee;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #ccc;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
            transition: 125ms all;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #aaa;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
        } */
`
const ArchiveSidebar = ({
    counts,
    filters,
    setFilters
}) => {
    const handleFilter = ({ property, value }) => {
        setFilters(filters => {
            const prevIndex = filters.findIndex(f => f.property === property && f.value === value);
            if (prevIndex !== -1) {
                return filters.slice(0, prevIndex).concat(filters.slice(prevIndex + 1));
            } else {
                return [...filters, {
                    property,
                    value,
                    operation: containsProperties.includes(property) ? 'contains' : 'match'
                }]
            }
        })
    }
    return <SidebarContainer item xs={12} md={3}>
        {Object.entries(counts).map(([title, values], i) => (
            <FilterSection
                key={i}
                filters={filters}
                title={title}
                counts={values}
                handleFilter={handleFilter}
            />
        ))}
    </SidebarContainer>
}

const ArchiveBody = ({
    stories,
    setActiveStory
}) => {
    return <Grid item xs={12} md={9}>
        <Grid container spacing={3} sx={{ p: 1 }}>
            <Typography variant="h5" sx={{ pb: 3, pt: 1 }}>Entries</Typography>
            {stories.map((story, i) => (
                <StoryCard key={i} story={story} setActiveStory={setActiveStory} />
            )
            )}
        </Grid>
    </Grid>
}

const GradientBox = styled.div`
    background: rgb(24,113,119);
    background: linear-gradient(180deg, rgba(24,113,119,1) 0%, rgba(102,69,20,1) 100%);
    color: white;
    padding: 1em;
`

const ShareLink = styled.a`
    border: 1px solid white;
    padding:.5em;
    display:inline-block;
    font-size:.75rem;
    color:white;
    text-decoration:none;
`
const HarmLink = styled.a`
    font-size:.75rem;
    color:white;
    text-decoration:none;
`
const WrittenContainer = styled.div`
    max-height: ${({ tall }) => tall ? '50vh' : '20vh'};
    padding:.5rem;
    overflow-y: auto;
    
    ::-webkit-scrollbar {
        width: .5rem;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #2b2b2b77;
        border:1px solid #999;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #999;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
        transition: 125ms all;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: url("${process.env.PUBLIC_URL}/icons/grip.png"), #f9f9f9;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
    }
`

const MarkdownViewer = ({
    content = "",
    url = "",
    id,
    tall = false
}) => {
    const fetcher = url
        ? () => fetch(url).then(res => res.text()).then(text => text.replaceAll("<br>", "\n &nbsp;"))
        : () => Promise.resolve(content)
    const { data: text } = useSWR(id, fetcher)
    return <WrittenContainer tall={tall}>
        {!!text && <ReactMarkdown>{text}</ReactMarkdown>}
    </WrittenContainer>
}

const StoryPlayer = ({
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
                <img src={photoUrl} style={{ maxWidth: '100%', maxHeight: '50vh', display: 'block', margin: '0 auto' }} />
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
const StoryContainer = ({
    story
}) => {
    if (!story.type) {
        return null
    }

    const {
        storyId,
        theme,
        fips,
        tags,
        type,
        title,
        county
    } = story;


    const entryTitle = title?.length ? title : `A ${type} story`
    return <GradientBox>
        <Typography variant="h3" element="h2" fontFamily="'Playfair Display', serif;">
            {entryTitle}
        </Typography>
        <Typography variant="h6" sx={{ pb: 1 }}>
            in {county}
        </Typography>
        <StoryPlayer story={story} />
        <Grid container sx={{ py: 2 }}>
            <Grid item xs={12} md={6}>
                <Typography>
                    Theme
                </Typography>
                <Typography variant="h6" sx={{ pb: 1 }}>
                    {theme}
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {!!tags?.length && <>
                    <Typography>
                        Tags
                    </Typography>
                    <Typography variant="h6" sx={{ pb: 1 }}>
                        {tags.map(t => `#${t}`).join(', ')}
                    </Typography>
                </>}
            </Grid>
            <Grid item xs={12} sx={{pt: 2, borderTop: '1px solid #ffffff44'}}></Grid>
            <Grid item xs={12} md={6}>
                <ShareLink href="https://stories.uscovidatlas.org/" target="_blank" rel="noopener noreferrer">
                    Want to contribute to Atlas Stories?
                    <br />
                    Share your pandemic experience.
                </ShareLink>
            </Grid>
            <Grid item xs={12} md={6}>
                <HarmLink href={`/contact?category=HarmfulContent&id=${story.id}`} target="_blank" rel="noopener noreferrer">
                    Is this content harmful? Report it here.
                </HarmLink>
            </Grid>
        </Grid>
    </GradientBox>
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    boxShadow: 24,
};

const ArchiveModal = ({
    open,
    onClose,
    story
}) => {
    return <Modal open={open} onClose={() => onClose()}>
        <Box sx={modalStyle}>
            <StoryContainer story={story} />
        </Box>
    </Modal>
}

export default function Archive() {
    const [filters, setFilters] = useState([]);
    const [activeStory, setActiveStory] = useState({});
    const {
        stories,
        counts,
        relatedStories
    } = useStories({
        filters
    })

    return (
        <ArchivePage>
            <NavBar light />
            <ContentContainer>
                <Grid container spacing={3}>
                    <ArchiveSidebar counts={counts} setFilters={setFilters} filters={filters} />
                    <ArchiveBody stories={stories} setActiveStory={setActiveStory} />
                </Grid>
            </ContentContainer>
            <Footer />
            <ArchiveModal
                open={!!activeStory.id}
                onClose={() => setActiveStory({})}
                story={activeStory}
            />
        </ArchivePage>
    );
}
