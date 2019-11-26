import React, { useEffect, useState } from 'react';
//-------------------------------------------------------------------- my imports
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { IState, selection } from '../store';
import MetricsGraph from './../Features/MetricsGraph/MetricsGraph';
//-------------------------------------------------------------------- custom styles
const useStyles = makeStyles({
  main: {
    // margin: 25
  },
  input: {
    width: 800,
    margin: 25
  },
})
//-------------------------------------------------------------------- selections
const getSelections = (state: IState) => {
  const { selections } = state.metric
  return selections;
}
const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected;
}
//--------------------------------------------------------------------
const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selections = useSelector(getSelections);
  const selected = useSelector(getSelected);
  //--------------------------------------------------------------------
  const handleChangeSelected = (_event: React.ChangeEvent<{}>, values: selection[]) => {
    dispatch(actions.updateSelected(values))
  }
  //--------------------------------------------------------------------
  const thirtyMinsAgo = Date.now() - 1800000;
  //--------------------------------------------------------------------
  const query =
    `query Test{
      getMultipleMeasurements(input: 
        [
          ${selected.map(item => (
      '{' +
      'metricName:"' + item.title + '"' +
      'after:' + thirtyMinsAgo.toString() +
      '}'
    )
    )}
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
    query
  })
  //--------------------------------------------------------------------
  const { data, error } = result;
  //--------------------------------------------------------------------
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorAction({ error: error.message }));
      return;
    }
    if (!data) return;
    //--------------------------------------------------------------------
    const { getMultipleMeasurements } = data
    if (selected.length !== 0) {
      let newGraphData: never[] | never[] | { [x: string]: any; }[] = [];
      getMultipleMeasurements.forEach((measurement: any, i: number) => {
        measurement.measurements.forEach((item: { [x: string]: any; }, j: number) => {
          if (i === 0) {
            let newDataPoint = {} as any;
            newDataPoint['name'] = item['at']
            newDataPoint[measurement.metric] = item['value']
            newGraphData.push(newDataPoint as never);
          } else {
            newGraphData[j][measurement.metric] = item['value']
          }
        })
      })
      dispatch(actions.setGraphData(newGraphData as any))
    }
    //--------------------------------------------------------------------
  }, [dispatch, data, error])
  //--------------------------------------------------------------------
  return (
    <div className={classes.main}>
      <Autocomplete
        className={classes.input}
        multiple
        options={selections}
        getOptionLabel={option => option.title}
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
      {selected.length > 0 ?
        <MetricsGraph />
        : null}
    </div>
  )
}
//--------------------------------------------------------------------
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
//--------------------------------------------------------------------
export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};