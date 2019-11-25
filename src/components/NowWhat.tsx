import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Provider, createClient, useQuery } from 'urql';
//--------------------------------------------------------------------
//-------------------------------------------------------------------- selections
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
  const dispatch = useDispatch();
  let [selected, setSelected] = useState([''])

  const handleChangeSelected = (_event: React.ChangeEvent<{}>, values: selection[]) => {
    setSelected(selected = values.map((value) => value.title))
    dispatch(actions.updateSelected(selected))
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
  //-------------------------------------------------------------------
  const [result] = useQuery({
    query,
    variables: {
      selected
    }
  })
  const { fetching, data, error } = result;

  useEffect(() => {
    if(error) {
      dispatch(actions.metricsApiErrorAction({error: error.message}));
      return;
    }
    if(!data) return;

    console.log(data);
  }, [dispatch, data, error])
  //--------------------------------------------------------------------
  return (
    <div
      style={{
        width: 1000,
        marginTop: 25
      }}
    >
      <Autocomplete
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
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};