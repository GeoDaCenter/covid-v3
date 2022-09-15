import { useSelector } from "react-redux";
import useGetVariable from "./useGetVariable";
import { quantile, quantileRank } from 'simple-statistics'
import { useEffect, useState } from "react";

export default function useGetQuantileStatistics({
    variable="Confirmed Count per 100K Population",
    dataset=null,
    geoid=null,
    getStateStats=true,
    neighborGroups = [],
    dateIndex = false,
}){
    const [stats, setStats] = useState({});
    // pieces of redux state
    const currentData = useSelector(({params}) => params.currentData);
    const geojsonData = useSelector(({ data }) => data.storedGeojson[dataset||currentData]);
    const geoidProperties = geojsonData?.properties && geojsonData.properties[geoid];
    const data = useGetVariable({
        variable,
        dateIndex
    });
    
    useEffect(() => {
        if (data.length) {
            let tempResults = {
                geoidProperties,
                variable
            };
            if (geoid === null){
                tempResults.sum = data.reduce((a,b) => a+b);
                tempResults.mean = tempResults.sum/data.length;
                tempResults.totalPop = geojsonData?.data?.features?.reduce((a,b) => a+b.properties.population, 0);
                tempResults.nationalSummary = variable.includes("per 100K") || variable.includes("Percent") 
                    ? data.reduce((a,b,idx) => a+b*geojsonData.properties[geojsonData.order.indexOrder[idx]]?.population,0) / tempResults.totalPop
                    : data.reduce((a,b) => a+b);
            }
            [tempResults.min, tempResults.max] = [Math.min(...data), Math.max(...data)];
            [tempResults.q25, tempResults.q50, tempResults.q75] = [.25, .5, .75].map(q => quantile(data, q))

            if (geoid !== null){
                tempResults.geoidIdx = geoid !== null ? geojsonData.order.geoidOrder[geoid] : null;
                tempResults.geoidData = tempResults.geoidIdx !== null ? data[tempResults.geoidIdx] : null;
                tempResults.geoidQ = tempResults.geoidData !== null ? quantileRank(data, tempResults.geoidData) : false;
                if (neighborGroups?.length && geojsonData?.order?.geoidOrder){      
                    neighborGroups.forEach(group => {
                        const { prefix, ids } = group;
                        if (ids?.length){
                            const neighborIndices = ids.map(id => geojsonData.order.geoidOrder[id])
                            const neighborData = data.filter((_,idx) => neighborIndices.includes(idx));
                            tempResults[`${prefix}Q50`] = quantile(neighborData, .5);
                            tempResults[`${prefix}Q25`] = quantile(neighborData, .25);
                            tempResults[`${prefix}Q75`] = quantile(neighborData, .75);
                            tempResults[`${prefix}Sum`] = neighborData.reduce((a,b) => a+b);
                            tempResults[`${prefix}Mean`] = tempResults[`${prefix}Sum`]/neighborData.length;
                            tempResults[`${prefix}Pop`] = ids.reduce((a,b) => a+geojsonData.properties[b].population, 0);
                            tempResults[`${prefix}Summary`] = variable.includes("per 100K") || variable.includes("Percent") 
                                ? neighborData.reduce((a,b,idx) => a+b*geojsonData.properties[ids[idx]].population,0) / tempResults[`${prefix}Pop`]
                                : neighborData.reduce((a,b) => a+b);
                            tempResults[`${prefix}Max`] = geojsonData.properties[ids[neighborData.indexOf(Math.max(...neighborData))]].NAME;
                            tempResults[`${prefix}Min`] = geojsonData.properties[ids[neighborData.indexOf(Math.min(...neighborData))]].NAME;
                        }
                    })
                }
            }
            setStats(tempResults)
        }

    },[data.length, geoid, dataset, variable, getStateStats, JSON.stringify(geoidProperties), JSON.stringify({neighborGroups})]);
    
    return stats
}