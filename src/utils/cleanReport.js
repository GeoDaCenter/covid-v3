export async function cleanLayout(report, compress = false) {
  const removeProps = ['moved','static','i','key']
  const {layout, items} = report;
  let template = []
  for (const page of layout){
    let pageItems = []
    for (const item of page){
      let tempItem = {
        ...items[item.i],
        ...item,
      }
      removeProps.forEach(prop => delete tempItem[prop])
      pageItems.push(tempItem)
    }
    template.push(pageItems)
  }
  if (compress){
    return JSON.stringify(template)
  } else {
  return template
  }
}

// async function compressLayout(layoutString){
//     const lzutf8 = await import('lzutf8')
//     var compressed = lzutf8.compress(layoutString);
//     return compressed
// }
// async function decompressLayout(layoutString){
//     const lzutf8 = await import('lzutf8')
//     var compressed = lzutf8.decompress(layoutString);
//     return compressed
// }
