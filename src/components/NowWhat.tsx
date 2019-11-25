import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
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
export type selection = { title: string }

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let [selected, setSelected] = useState([''])

  const handleChangeSelected = (_event: React.ChangeEvent<{}>, values: selection[]) => {
    setSelected(selected = values.map((value) => value.title))
    dispatch(actions.updateSelection(selected))
  }
  //--------------------------------------------------------------------
  const query =
    `query Test{
      getMultipleMeasurements(input: 
        [
          ${selected.map((item) => '{metricName:"' + item + '"}')}
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
    }`
  const [result] = useQuery({
    query,
    variables: {
      selected
    }
  })
  const { fetching, data, error } = result;

  useEffect(() => {
    // console.log(data);
  }, [data])
  //--------------------------------------------------------------------
  return (
    <div
      style={{
        width: 1000,
        marginTop: 25
      }}
    >
      <Autocomplete
        className={classes.input}
        multiple
        options={selections}
        getOptionLabel={option => option.title}
        style={{ width: 1000 }}
        renderInput={params => (
          <TextField
            {...params}
            label="Metrics"
            variant="outlined"
            fullWidth
          />
        )}

        onChange={(event, values) => {
          handleChangeSelected(event, values);
        }}

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