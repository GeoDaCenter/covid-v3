import { useMemo } from 'react';
import useSWR from 'swr';
import { findCounty, findIn } from '../utils';
import bbox from '@turf/bbox';
import {randomPosition} from '@turf/random';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { useSelector } from 'react-redux';
import { useGeoda } from '../contexts/Geoda';
import useGetGeojson from './useGetGeojson';
import { paramsSelectors } from '../stores/paramsStore';
import { dataSelectors } from '../stores/dataStore'
const { selectStoredGeojson } = dataSelectors;
const { selectDatasets } = paramsSelectors;

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

function useCentroidRandomizer() {
    const storedGeojson = useSelector(selectStoredGeojson);
    const datasets = useSelector(selectDatasets);
    const { geoda, geodaReady } = useGeoda();
    const usafactsDataset = findIn(datasets, "file", 'county_usfacts.geojson');
    const [geo] = useGetGeojson({
        geoda,
        geodaReady,
        currDataset: usafactsDataset,
        storedGeojson
    });
    const getPoint = (bounds, geog) => {
        const xy = randomPosition(bounds);
        const point = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": xy
            }
        }

        if (booleanPointInPolygon(point, geog)) {
            return xy;
        } else {
            return getPoint(bounds, geog);
        }
    }
    const getRandomPoint = (geoid) => {
        if (geo?.data){
            const geog = geo.data.features.find(f => f.properties.GEOID === geoid)
            const bounds = bbox(geog.geometry);
            const point = getPoint(bounds, geog);
            return point;
        }
    }
    return {
        ready: !!geo?.data,
        getRandomPoint
    }
}

export const useStories = ({
    selectedStory = {},
    filters = [],
    singleStoryId = ''
}) => {

    const {
        ready: centroidReady,
        getRandomPoint
    } = useCentroidRandomizer();
    const fetcher = centroidReady 
    ? (url) => fetch(url)
    .then(r => r.json())
    .then(rows => rows.map(row =>
        ({ ...row, ...findCounty(row.fips), centroid: getRandomPoint(row.fips) })
        ))
        .catch(err => console.log(err))
        : () => [];
        const fetchName = centroidReady 
        ? `${process.env.REACT_APP_STORIES_PUBLIC_URL}/index.json` 
        : 'null-data'

    const { data: allStories, error } = useSWR(
        fetchName,
        fetcher        
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

    const activeStory = useMemo(() => {
        if (!allStories?.length){
            return {}
        }
        if (singleStoryId) {
            return allStories.find(story => story.id === singleStoryId)
        }
        return selectedStory
    }, [allStories?.length, JSON.stringify({singleStoryId, selectedStory})])
    
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
        if (!activeStory.id) {
            return [];
        }
        const tags = activeStory.tags;
        const county = activeStory.county;
        const theme = activeStory.theme;
        const state = activeStory.county.split(',').slice(-1)[0];
        return allStories.map(story => {
            if (story.id === activeStory.id) {
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
    }, [JSON.stringify(activeStory), allStories?.length]);

    return {
        stories,
        counts,
        relatedStories,
        activeStory
    }
}
