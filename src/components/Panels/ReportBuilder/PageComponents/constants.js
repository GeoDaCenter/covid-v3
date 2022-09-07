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
  "State Median": { header: "State Median", accessor: "stateQ50" },
  "State 25 %ile": { header: "State 25 %ile", accessor: "stateQ25" },
  "State 75 %ile": { header: "State 75 %ile", accessor: "stateQ75" },
  "State Min": { header: "State Min", accessor: "stateMin" },
  "State Max": { header: "State Max", accessor: "stateMax" },
  "National Median": { header: "National Median", accessor: "q50" },
  "National 25 %ile": { header: "National 25 %ile", accessor: "q25" },
  "National 75 %ile": { header: "National 75 %ile", accessor: "q75" },
  "National Min": { header: "National Min", accessor: "min" },
  "National Max": { header: "National Max", accessor: "max" },
};

export const ALL_COLUMNS = [
  { label: "Metric Name", value: "Metric" },
  { label: "County Value", value: "County" },
  { label: "County Percentile", value: "County Percentile" },
  { label: "State Median", value: "State Median" },
  { label: "State 25 %ile", value: "State 25 %ile" },
  { label: "State 75 %ile", value: "State 75 %ile" },
  { label: "State Minimum", value: "State Min" },
  { label: "State Maximum", value: "State Max" },
  { label: "National Median", value: "National Median" },
  { label: "National 25 %ile", value: "National 25 %ile" },
  { label: "National 75 %ile", value: "National 75 %ile" },
  { label: "National Minimum", value: "National Min" },
  { label: "National Maximum", value: "National Max" },
];

export const DEFAULT_COLUMNS = [
  "Metric",
  "County",
  "State Median",
  "National Median",
];
