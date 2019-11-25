import React, { useEffect } from 'react';
// import Card from '@material-ui/core/Card';
// import CardHeader from './CardHeader';
// import Typography from '@material-ui/core/Typography';
// import CardContent from '@material-ui/core/CardContent';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Avatar from './Avatar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Provider, createClient, useQuery } from 'urql';
//--------------------------------------------------------------------
const useStyles = makeStyles({
  input: {
    margin: '30',
  }
});
//--------------------------------------------------------------------
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
const query = `
query Test{
	getMultipleMeasurements(input: 
    [
      {
        metricName:"oilTemp"
      }
    ]
  ){
    metric
    measurements{
      metric
      at
      value
      unit
    }
  }
}
`
//--------------------------------------------------------------------
const selections = [
  { title: 'injValveOpen' },
  { title: 'oilTemp' },
  { title: 'tubingPressure' },
  { title: 'flareTemp' },
  { title: 'casingPressure' },
  { title: 'waterTemp' },
]
//--------------------------------------------------------------------


const Metrics = () => {
  const classes = useStyles();

  const [result] = useQuery({
    query,
  })
  const { fetching, data, error } = result;

  useEffect(() => {
    console.log('Testing');
    console.log(data);
  }, [data])

  return (
    <div
      style={{ width: 500 }}
    >
      <Autocomplete
        className={classes.input}
        multiple
        id="combo-box"
        options={selections}
        getOptionLabel={option => option.title}
        style={{ width: 300 }}
        renderInput={params => (
          <TextField
            {...params}
            label="Metrics"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  )
}
//--------------------------------------------------------------------
export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};