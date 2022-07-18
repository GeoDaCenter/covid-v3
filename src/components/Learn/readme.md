# Readme: Learn and community toolkit pages

This is a collection of pages that are used to help people learn and share the Atlas. Each page uses an MDX file (markdown + jsx) to describe and render content. 
In each mdx file, the markdown is exported as the main content, and an additional object (`const config`) is exported for the url path (slug), page title, and page description.
The markdown content should have a line break before and after it. 

## Adding your page to the site

After you have created your mdx content, import it to `MdxPages.js` following the import pattern (`import * as PageName from './pagename.mdx`).
Next, add your page to the `pages` object following the pattern of previous entries. The full file should look something like this:

```
import * as Pagename from './Pagename.mdx'
import * as Pagename2 from './Pagename2.mdx'

const pages {
    [Pagename.config.slug] = Pagename
    [Pagename2.config.slug] = Pagename2
}
```

That's it! The slug for your page should now be available at uscovidatlas.org/learn/pagename.


## Updating /learn

The learn page is a separate route, since it does not based on MDX. See `src/components/Pages/Learn.js`.