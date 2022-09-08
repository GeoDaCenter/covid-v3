import { createContext, useState, useContext } from 'react';
// import { useDispatch } from 'react-redux';
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
  // const dispatch = useDispatch();
  // fetching stories from index
  const {
    stories,
    relatedStories
  } = useStories({
    selectedStory
  });
  
  // useEffect(() => {
  //   dispatch({ type: 'SET_PANELS', payload: { params: { storiesPane: true } } })
  // }, [selectedStory?.id])

  return (
    <StoriesContext.Provider value={{ stories, relatedStories, setSelectedStory, selectedStory }}>
      {children}
    </StoriesContext.Provider>
  );
};

/** Update the viewport from anywhere */
export const useStoriesContext = () => {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw Error('Not wrapped in <StoriesProvider />.');
  return ctx;
};
