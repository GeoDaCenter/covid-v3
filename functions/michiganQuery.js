const {BigQuery} = require('@google-cloud/bigquery');
const dayjs = require('dayjs');
const columns = require('./meta/columns.json');

const options = {
  credentials: {
      "type": "service_account",
      "project_id": process.env.BIGQUERY_PROJECT_ID,
      "private_key_id": process.env.BIGQUERY_SECRET_KEY_ID,
      "private_key": process.env.BIGQUERY_SECRET_KEY.replace(/\\n/gm, '\n'),
      "client_email": process.env.BIGQUERY_CLIENT_EMAIL,
      "client_id": process.env.BIGQUERY_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.BIGQUERY_CLIENT_X509_CERT_URL
  },
  projectId: process.env.BIGQUERY_PROJECT_ID,
};

async function query(queryString, bigquery) {
  const options = {
    query: queryString,
    location: 'US',
  };
  const [job] = await bigquery.createQueryJob(options);
  return await job.getQueryResults();
};

exports.handler = async (event) => {
    try {
      const bigquery = new BigQuery(options);
      const result = await query(
        `SELECT fips_code as fips, ${columns['public.covid_confirmed_nyt'].slice(-1,)[0]} - ${columns['public.covid_confirmed_nyt'].slice(-7,)[0]} as weeklyAverage
            FROM covid-atlas.public.covid_confirmed_nyt
            WHERE fips_code >= 26000 AND fips_code < 27000
        `,
          bigquery);
      return { 
        statusCode: 200, 
        body: JSON.stringify({ data: result[0], date: columns['public.covid_confirmed_nyt'].slice(-1,)[0] }) 
      };
    } catch (error) {
        console.log(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed fetching data' }),
        };
    }
};