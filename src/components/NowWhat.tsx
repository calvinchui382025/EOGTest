import React, { useEffect } from 'react';
//-------------------------------------------------------------------- my imports
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../store';
import MetricsGraph from './../Features/MetricsGraph/MetricsGraph';
import MetricsInput from './../Features/MetricsGraph/MetricsInput';

//-------------------------------------------------------------------- 
const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected;
}
const thirtyMinsAgo = Date.now() - 1800000;
//--------------------------------------------------------------------
const Metrics = () => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  //--------------------------------------------------------------------

  //--------------------------------------------------------------------
  const query =
    `query getLastThirty{
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
  }, [dispatch, data, selected.length, error])
  //--------------------------------------------------------------------
  return (
    <div>
      <MetricsInput />
      {selected.length > 0 ? <MetricsGraph /> : null}
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