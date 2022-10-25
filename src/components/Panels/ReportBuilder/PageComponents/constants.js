// ##### TABLES
export const CommunityContextMetrics = [
  "Uninsured Percent",
  "Over 65 Years Percent",
  "Life Expectancy",
  "Percent Essential Workers",
  "Self-rated Health",
  "Adult Obesity",
  "Diabetes Prevalence",
  "Adult Smoking",
  "Excessive Drinking",
  "Drug Overdose Deaths",
  "Children in Poverty",
  "Income Inequality",
  "Median Household Income",
  "Food Insecurity",
  "Unemployment",
  "Preventable Hospital Stays",
  "Residential Segregation (Black - White)",
  "Severe Housing Problems",
].map((f) => ({ value: f, label: f }));

export const CovidMetrics = ["Cases", "Deaths", "Vaccination", "Testing"].map(
  (f) => ({
    value: f,
    label: f,
  })
);
export const CovidVarMapping = {
  Cases: ["Confirmed Count per 100K Population", "Confirmed Count"],
  Deaths: ["Death Count per 100K Population", "Death Count"],
  Vaccination: [
    "Percent Fully Vaccinated",
    "Percent Received At Least One Dose",
  ],
  Testing: [
    "7 Day Testing Positivity Rate Percent",
    "7 Day Tests Performed per 100K Population",
  ],
};
export const DEFAULT_METRICS = {
  COVID: Object.keys(CovidVarMapping),
  SDOH: [
    "Uninsured Percent",
    "Over 65 Years Percent",
    "Life Expectancy",
    "Percent Essential Workers",
    "Adult Obesity",
    "Preventable Hospital Stays",
    "Severe Housing Problems",
  ],
};
export const COLUMN_MAPPINGS = {
  Metric: { header: "Metric", accessor: "variable" },
  County: { header: "County", accessor: "geoidData" },
  "County Percentile": { header: "County Percentile", accessor: "geoidQ" },
  "stateQ50": { header: "State Median", accessor: "stateQ50" },
  "stateQ25": { header: "State 25 %ile", accessor: "stateQ25" },
  "stateQ75": { header: "State 75 %ile", accessor: "stateQ75" },
  "stateMin": { header: "State Min", accessor: "stateMin" },
  "stateMax": { header: "State Max", accessor: "stateMax" },
  "nationQ50": { header: "National Median", accessor: "q50" },
  "nationQ25": { header: "National 25 %ile", accessor: "q25" },
  "nationQ75": { header: "National 75 %ile", accessor: "q75" },
  "nationMin": { header: "National Min", accessor: "min" },
  "nationMax": { header: "National Max", accessor: "max" },
  "regionQ50": {header: "Region Median", accessor: "regionQ50"},
  "regionQ25": {header: "Region 25 %ile", accessor: "regionQ25"},
  "regionQ75": {header: "Region 75 %ile", accessor: "regionQ75"},
  "regionMin": {header: "Region Min", accessor: "regionMin"},
  "regionMax": {header: "Region Max", accessor: "regionMax"},
  "neighborQ50": {header: "Neighbor Median", accessor: "neighborQ50"},
  "neighborQ25": {header: "Neighbor 25 %ile", accessor: "neighborQ25"},
  "neighborQ75": {header: "Neighbor 75 %ile", accessor: "neighborQ75"},
  "neighborMin": {header: "Neighbor Min", accessor: "neighborMin"},
  "neighborMax": {header: "Neighbor Max", accessor: "neighborMax"},
};

export const ALL_STAT_AGGREGATIONS = [
  {
    label: "Metric Name",
    value: "Metric",
    subItems: [
      {
        label: "Show Metric Name",
        value: "Metric",
      }
    ]
  },
  {
    label: "County",
    value: "County",
    subItems: [
      {
        label: "County Value",
        value: "County",
      },
      {
        label: "County Percentile",
        value: "County Percentile",
      }
    ]
  },
  {
    label: "Neighboring Counties",
    value: "Neighboring Counties",
    subItems: [
      {
        label: "Min",
        value: "neighborMin"
      },
      {
        label: "25 %ile",
        value: "neighborQ25"
      },
      {
        label: "Median",
        value: "neighborQ50"
      },
      {
        label: "75 %ile",
        value: "neighborQ75"
      },
      {
        label: "Max",
        value: "neighborMax"
      }
    ]
  },
  {
    label: "Region",
    value: "Region",
    subItems: [
      {
        label: "Min",
        value: "regionMin"
      },
      {
        label: "25 %ile",
        value: "regionQ25"
      },
      {
        label: "Median",
        value: "regionQ50"
      },
      {
        label: "75 %ile",
        value: "regionQ75"
      },
      {
        label: "Max",
        value: "regionMax"
      }
    ]
  },
  {
    label: "State",
    value: "State",
    subItems: [
      {
        label: "Min",
        value: "stateMin"
      },
      {
        label: "25 %ile",
        value: "stateQ25"
      },
      {
        label: "Median",
        value: "stateQ50"
      },
      {
        label: "75 %ile",
        value: "stateQ75"
      },
      {
        label: "Max",
        value: "stateMax"
      }
    ]
  },
  {
    label: "National",
    value: "National",
    subItems: [
      {
        label: "Min",
        value: "nationMin"
      },
      {
        label: "25 %ile",
        value: "nationQ25"
      },
      {
        label: "Median",
        value: "nationQ50"
      },
      {
        label: "75 %ile",
        value: "nationQ75"
      },
      {
        label: "Max",
        value: "nationMax"
      }
    ]
  }
];

export const DEFAULT_COLUMNS = [
  "Metric",
  "County",
  "stateQ50",
  "nationQ50",
];
