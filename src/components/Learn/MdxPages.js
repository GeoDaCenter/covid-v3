import * as AddCustomData from './AddCustomData.mdx'
import * as ChangeOverTime from './ChangeOverTime.mdx'
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

const pages = {
    [AddCustomData.config.slug]: AddCustomData,
    [ChangeOverTime.config.slug]: ChangeOverTime,
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