import { createContext, useState, useContext } from 'react';
import { useStories } from '../hooks/useStories';

export const StoriesContext = createContext({
  stories: [],
  relatedStories: [],
  selectedStory: {},
  setSelectedStory: () => { },
});

export const StoriesProvider = ({ children }) => {
  // story state
  const [selectedStory, setSelectedStory] = useState({});
  // fetching stories from index
  const {
    stories,
    relatedStories
  } = useStories({
    selectedStory
  });
  
  return (
    <StoriesContext.Provider value={{ stories, relatedStories, setSelectedStory, selectedStory }}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStoriesContext = () => {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw Error('Not wrapped in <StoriesProvider />.');
  return ctx;
};
