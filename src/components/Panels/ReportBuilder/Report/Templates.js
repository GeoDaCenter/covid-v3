import { DEFAULT_METRICS } from "../PageComponents/constants";

export const templates = {
  "My County's Stats": [[{"w":4,"h":3,"x":0,"y":0,"type":"text","content":{"preset":"7day"}},{"w":4,"h":15,"x":4,"y":0,"type":"map","variable":"Confirmed Count per 100K Population"},{"w":4,"h":12,"x":0,"y":3,"type":"textReport"},{"w":4,"h":12,"x":0,"y":15,"type":"lineChart","table":"cases"},{"w":4,"h":12,"x":4,"y":15,"type":"lineChart","table":"deaths"},{"w":4,"h":15,"x":0,"y":27,"type":"table","topic":"COVID","metrics":["Cases","Deaths","Vaccination","Testing"]},{"w":4,"h":14,"x":4,"y":27,"type":"table","topic":"SDOH","metrics":["Uninsured Percent","Over 65 Years Percent","Life Expectancy","Percent Essential Workers","Adult Obesity","Preventable Hospital Stays","Severe Housing Problems"]}]],
  "A National Snapshot": [
    [
        {
            "type": "map",
            "w": 4,
            "h": 14,
            "variable": "Confirmed Count per 100K Population",
            "scale": "national",
            "x": 0,
            "y": 0
        },
        {
            "type": "map",
            "w": 4,
            "h": 14,
            "variable": "Death Count per 100K Population",
            "scale": "national",
            "x": 4,
            "y": 0
        },
        {
            "type": "map",
            "w": 4,
            "h": 14,
            "variable": "7 Day Testing Positivity Rate Percent",
            "scale": "national",
            "x": 0,
            "y": 14
        },
        {
            "type": "map",
            "w": 4,
            "h": 14,
            "variable": "Percent Fully Vaccinated",
            "scale": "national",
            "x": 4,
            "y": 14
        },
        {
            "type": "table",
            "w": 8,
            "h": 11,
            "label": "COVID Summary Table",
            "topic": "COVID",
            "metrics": [
                "Cases",
                "Deaths",
                "Vaccination",
                "Testing"
            ],
            "x": 0,
            "y": 28,
            "includedColumns": [
                "Metric",
                "National Median",
                "National Min",
                "National Max",
                "National 25 %ile",
                "National 75 %ile"
            ]
        }
    ],
    [
        {
            "table": "cases",
            "w": 8,
            "h": 15,
            "type": "lineChart",
            "label": "Cases Line Chart",
            "populationNormalized": false,
            "shouldShowVariants": true,
            "x": 0,
            "y": 0
        },
        {
            "table": "deaths",
            "w": 8,
            "h": 14,
            "type": "lineChart",
            "label": "Cases Line Chart",
            "shouldShowVariants": true,
            "x": 0,
            "y": 15
        },
        {
            "table": "vaccines_fully_vaccinated",
            "w": 8,
            "h": 14,
            "type": "lineChart",
            "label": "Cases Line Chart",
            "shouldShowVariants": true,
            "x": 0,
            "y": 29
        }
    ]
],
  "My Region's Snapshot": [
    [ ]
  ],
  "My Neighboring County's Stats": [
    [
      {
        type: "text",
        w: 4,
        h: .5,
        content: "Neighboring Counties Snapshot"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Confirmed Count per 100K Population",
        scale: "neighbors"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Death Count per 100K Population",
        scale: "neighbors"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Percent Fully Vaccinated",
        scale: "neighbors"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "7 Day Testing Positivity Rate Percent",
        scale: "neighbors"
      },
      {
        type: "table",
        topic: "COVID-REGIONAL",
        w: 4,
        h: 5,
        metrics: ["Cases", "Deaths", "Vaccination", "Testing"],
        includedColumns: ["variable","geoidData","stateQ50","q50","regionQ50","regionSummary","regionMax","regionMin"],
        geogToInclude: "neighbors"
        
      },
    ],
    [
      {
        type: "text",
        w: 4,
        h: 1,
        content: "Neighbor Trends and Historic Data"
      },
      {
        type: "lineChart",
        w: 2,
        h: 6,
        table: "cases",
        linesToShow: "neighbors",
        populationNormalized: true
      },
      {
        type: "lineChart",
        w: 2,
        h: 6,
        table: "deaths",
        linesToShow: "neighbors",
        populationNormalized: true
      },
      {
        type: "lineChart",
        w: 2,
        h: 6,
        table: "vaccines_fully_vaccinated",
        linesToShow: "neighbors",
        populationNormalized: true
      },
      {
        type: "lineChart",
        w: 2,
        h: 6,
        table: "testing_wk_pos",
        linesToShow: "neighbors",
        populationNormalized: true
      },
    ],
    [
      {
        type: "text",
        w: 4,
        h: 1,
        content: "Hotspots"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Confirmed Count per 100K Population",
        scale: "neighbors",
        mapType: "lisa"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Death Count per 100K Population",
        scale: "neighbors",
        mapType: "lisa"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "Percent Fully Vaccinated",
        scale: "neighbors",
        mapType: "hinge15_breaks"
      },
      {
        type: "map",
        w: 2,
        h: 5,
        variable: "7 Day Testing Positivity Rate Percent",
        scale: "neighbors",
        mapType: "lisa"
      }
    ],
  ],
  "Something Else (Blank Report)": [[]],
};
