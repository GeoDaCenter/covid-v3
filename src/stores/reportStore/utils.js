import { nanoid } from 'nanoid'
import { templates } from '../../components/Panels/ReportBuilder/Report/Templates'

export function generateReportLayout(spec) {
  const template = templates[spec]
  let items = {}
  let layout = template.map((_) => [])
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      // const keys = [...Object.keys(items)].reverse();
      // const stringifiedKeys = keys.join(" ");
      const currItem = template[i][j]
      const { w, h, x, y } = currItem //type
      const key = nanoid()
      items[key] = {
        ...currItem,
        key,
      }
      layout[i].push({
        w: w || 10,
        h: h || 10,
        x: x || 0,
        y: y || 0,
        i: key,
      })
    }
  }

  return {
    items,
    layout,
  }
}
