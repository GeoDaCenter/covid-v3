import * as AddCustomData from './AddCustomData.mdx'
import * as CommunityContexts from './CommunityContexts.mdx'
import * as CommunityReports from './CommunityReports.mdx'
import * as EmergingTrends from './EmergingTrends.mdx'
import * as GettingStarted from './GettingStarted.mdx'
import * as HotspotMaps from './HotspotMaps.mdx'
import * as SharingDataFindings from './SharingDataFindings.mdx'
import * as ThematicMaps from './ThematicMaps.mdx'
import * as Stylesheet from './Stylesheet.mdx'
import * as SpatialTimeScales from './SpatialTimeScales.mdx'
import * as ReleaseNotes from './ReleaseNotes.mdx'
import * as BugReport from './BugReport.mdx'

/**
 * Page content for the "Learn"
 *
 * Below, the constant "pages" is a dictionary of page content. The key is the
 * page's URL slug, and the value is the page's content, as an MDX component.
 *
 * @category LearnContent
 * @example
 *     import { ExamplePageComponent } from './ExamplePageComponent'
 *     const pages = {
 *         'example-page': ExamplePageComponent,
 *     }
 *
 *     export default pages
 *
 * @constant {MdxPages}
 */
const pages = {
    [AddCustomData.config.slug]: AddCustomData,
    [CommunityContexts.config.slug]: CommunityContexts,
    [CommunityReports.config.slug]: CommunityReports,
    [EmergingTrends.config.slug]: EmergingTrends,
    [GettingStarted.config.slug]: GettingStarted,
    [HotspotMaps.config.slug]: HotspotMaps,
    [SharingDataFindings.config.slug]: SharingDataFindings,
    [ThematicMaps.config.slug]: ThematicMaps,
    [Stylesheet.config.slug]: Stylesheet,
    [SpatialTimeScales.config.slug]: SpatialTimeScales,
    [ReleaseNotes.config.slug]: ReleaseNotes,
    [BugReport.config.slug]: BugReport,
}

export default pages

/**
 * @typedef {Object} PageConfig
 * @property {string} slug - The page slug (used in the URL)
 * @property {string} title - The page title (head/meta)
 * @property {string} description - The page description (head/meta)
 */

/**
 * @typedef {Object} MdxPage
 * @property {PageConfig} config - The page config
 * @property {React.Component} default - The page component
 */
/** @typedef {Object<string, MdxPage>} MdxPages */
