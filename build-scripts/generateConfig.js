const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Papa = require('papaparse');

const [_nodeV, _script, devFlag] = process.argv
const isDev = devFlag === "--dev" 

const baseUrl = isDev
    ? 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUBTrW-lacG9uzAcBZRAZAXD2gmKg2LPPvAxd-jS0-wBCnThTzjSAW1CqA2DHo8cnB9-pZGByJsk1/pub?output=csv'
    : 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVLk2BtmeEL6LF6vlDJBvgL_JVpvddfMCYjQPwgVtlzTanUlscDNBsRKiJBb3Vn7jumMJ_BEBkc4vi/pub?output=csv'
    
isDev && console.log('GENERATING DEV CONFIG')

const basePath = path.join(__dirname, '../src/config');
const generateVariables = async () => {
    const csvString = await axios.get(baseUrl + '&gid=0').then(res => res.data);
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
    }).data.filter(f => f.deprecated != 1)
    
    fs.writeFileSync(path.join(basePath, 'variables.js'), `
    // this is a generated file, do not edit directly. See Google sheets to update variable config
    const variables = ${JSON.stringify(data)}; 
    export default variables;
    `)
    return data
}

const generateTables = async () => {
    const csvString = await axios.get(baseUrl + '&gid=197339675').then(res => res.data);
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
    }).data.filter(f => f.deprecated != 1)
    fs.writeFileSync(path.join(basePath, 'tables.js'), `
    // this is a generated file, do not edit directly. See Google sheets to update variable config
    const tables = ${JSON.stringify(data)}; 
    export default tables;
    `)
    return data
}

const generateDatasets = async () => {
    const csvString = await axios.get(baseUrl + '&gid=1300671439').then(res => res.data);
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
    }).data.filter(f => f.deprecated != 1)

    const parsedData = data.map(d => ({
        ...d,
        tables: d.tables ? d.tables.split(',').map(info => ({ [info.split(':')[0]]: info.split(':')[1] })).reduce((prev, curr) => ({...prev, ...curr})) : {}
    }))

    fs.writeFileSync(path.join(basePath, 'datasets.js'), `
    // this is a generated file, do not edit directly. See Google sheets to update variable config
    const datasets = ${JSON.stringify(parsedData)};
    export default datasets;
    `)
    return parsedData
}

const generateVariableTree = async () => {
    const csvString = await axios.get(baseUrl + '&gid=1673692402').then(res => res.data);
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
    }).data.filter(f => f.deprecated != 1)
    let parsedData = {}
    
    data.forEach((entry) => {
        parsedData[entry.key] = {
            Tooltip: entry.tooltip,
            County: entry.County?.split(',')||[],
            State: entry.County?.split(',')||[],
        }
    })
    fs.writeFileSync(path.join(basePath, 'variableTree.js'), `
    // this is a generated file, do not edit directly. See Google sheets to update variable config
    const variableTree = ${JSON.stringify(parsedData)};
    export default variableTree;
    `)
}


const generateDefaults = async () => {
    const csvString = await axios.get(baseUrl + '&gid=1965167264').then(res => res.data);
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
    }).data.filter(f => f.deprecated != 1)

    let fileString =  `// this is a generated file, do not edit directly. See Google sheets to update variable config \n`
    data.forEach(d => {
        if (d.variable === 'tooltipTables') {
            fileString += `export const ${d.variable} = ${JSON.stringify(d.value.split('|'))} \n`

        } else {
            fileString += `export const ${d.variable} = ${JSON.stringify(d.value)} \n`
        }
    })

    fs.writeFileSync(path.join(basePath, 'defaults.js'), fileString)
    return data
}

// const generateLegacyDatasets = async () => {
//     const tables = await generateTables();
//     const datasets = await generateDatasets();
//     let returnObj = {};
//     datasets.forEach(d => {
//         let returnTables = {};
//         try {
//             returnTables = Object.entries(d.tables).map(entry=>({[entry[0]]: tables.find(t => t.Id === entry[1])})).reduce((prev, curr) => ({...prev, ...curr}))
//         } catch {}
        
//         returnObj[d.file] = {
//             ...d,
//             geosjon: d.file,
//             tables: returnTables
//         }
//     })
//     fs.writeFileSync(path.join(basePath, 'legacyDatasets.js'),  `// this is a generated file, do not edit directly. See Google sheets to update variable config \n export default ${JSON.stringify(returnObj)}`)
// }

console.log('Generating variables, tables, datasets, and defaults from CMS.')
const _variables = generateVariables();
const _tables = generateTables();
const _datasets = generateDatasets();
const _defaults = generateDefaults();
const _variableTree = generateVariableTree();
console.log('Config generation complete.')