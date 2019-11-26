import React, { useEffect, useState } from 'react';
//--------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
import { Provider, createClient, useQuery } from 'urql';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { IState } from '../store';
//--------------------------------------------------------------------
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
  return selections
}

const lineColor: { [key: string]: string } = {
  'injValveOpen': '#56ff00',
  'oilTemp': '#ff8d00',
  'tubingPressure': '#00f9ff',
  'flareTemp': '#E14343',
  'casingPressure': '#fd00ff',
  'waterTemp': '#0004FF',
}
//--------------------------------------------------------------------
export type selection = { title: string }
//--------------------------------------------------------------------

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selections = useSelector(getSelections);
  let [selected, setSelected] = useState([] as string[])
  let [graphData, setGraphData] = useState([])
  //--------------------------------------------------------------------
  const handleChangeSelected = (_event: React.ChangeEvent<{}>, values: selection[]) => {
    setSelected(selected = values.map((value) => value.title))
    dispatch(actions.updateSelected(selected))
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
      'metricName:"' + item + '"' +
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
    if (selected !== []) {
      let newGraphData: any[] | never[] | { [x: string]: any; }[] = [];
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
      setGraphData(newGraphData as any)
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
        <LineChart
          width={800}
          height={400}
          data={graphData}
        >
          <Tooltip />
          {
            selected.map((item: string) => (
              <Line type="monotone" dataKey={item} stroke={lineColor[item]} />
            ))
          }
          <XAxis
            dataKey="name"
            domain={['auto', 'auto']}
            interval={240}
            tickFormatter={(tick) => moment(tick).format('HH:mm')}
            type='number'
            scale='time'
          />
          <YAxis />
        </LineChart>
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