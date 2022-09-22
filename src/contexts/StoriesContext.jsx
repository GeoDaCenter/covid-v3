import { createContext, useState, useContext } from 'react';
import { useStories } from '../hooks/useStories';

export const StoriesContext = createContext({
  stories: [],
  relatedStories: [],
  selectedStory: {},
  setSelectedStory: () => { },
});

/**
 * Wrapper component for the stories context.
 *
 * @category Contexts
 * @example
 *   function MyApp() {
 *     return (
 *       <StoriesProvider>
 *         <MyChildComponent />
 *       </StoriesProvider>
 *     )
 *   }
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Viewport} props.defaultViewport - Initial viewport
 * @returns {React.Component} - ViewportContext.Provider
 */
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

/**
 * A hook that returns the current viewport. Separated from `useSetViewport` to
 * avoid unnecessary re-renders.
 *
 * @category Contexts
 */
export const useStoriesContext = () => {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw Error('Not wrapped in <StoriesProvider />.');
  return ctx;
};
