import * as ChangeOverTime from './ChangeOverTime.mdx'
import * as ChoroplethMap from './ChoroplethMap.mdx'
import * as CreateReport from './CreateReport.mdx'
import * as Hotspots from './Hotspots.mdx'
import * as IdentifyTrends from './IdentifyTrends.mdx'
import * as LoadData from './LoadData.mdx'

const pages = {
    [LoadData.config.slug]: LoadData,
    [ChangeOverTime.config.slug]: ChangeOverTime,
    [ChoroplethMap.config.slug]: ChoroplethMap,
    [CreateReport.config.slug]: CreateReport,
    [Hotspots.config.slug]: Hotspots,
    [IdentifyTrends.config.slug]: IdentifyTrends,
}

export default pages