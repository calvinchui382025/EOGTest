import React, { useEffect } from 'react';
//-------------------------------------------------------------------- my imports
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/MetricsGraph/reducer';
import { Provider, createClient, useQuery, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { IState } from '../store';
import MetricsGraph from './../Features/MetricsGraph/MetricsGraph';
import MetricsInput from './../Features/MetricsGraph/MetricsInput';
//-------------------------------------------------------------------- 
const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected;
}
const getGraphData = (state: IState) => {
  const { graphData } = state.metric
  return graphData;
}
const getSelection = (state: IState) => {
  const { selections } = state.metric
  return selections
}
const thirtyMinsAgo = Date.now() - 1800000;
//--------------------------------------------------------------------
const Metrics = () => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  const selections = useSelector(getSelection)
  const graphData = useSelector(getGraphData);
  //--------------------------------------------------------------------
  const getLastThirty =
    `query getLastThirty{
      getMultipleMeasurements(input: 
        [
          ${selections.map(item => (
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
  const subscriptionQuery =
    `subscription selectedSubscription{
      newMeasurement{
        metric
        at
        value
        unit
      }
    }`
  //-------------------------------------------------------------------
  const [lastThirtyResult] = useQuery({
    query: getLastThirty
  })
  const { data, error } = lastThirtyResult;
  //-------------------------------------------------------------------- useEffect for last thirty minutes of data
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorAction({ error: error.message }));
      return;
    }
    if (!data) return;
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
      // console.log(newGraphData)
      dispatch(actions.setGraphData(newGraphData as any))
    }
  }, [dispatch, data, selected.length, error])
  //--------------------------------------------------------------------
  const [subscriptionResult] = useSubscription({
    query: subscriptionQuery,
  })
  const subscriptionData = subscriptionResult.data
  const subscriptionError = subscriptionResult.error
  //-------------------------------------------------------------------- useEffect for subscription data
  useEffect(() => {
    if (subscriptionError) {
      dispatch(actions.metricsApiErrorAction({ error: subscriptionError.message }));
      return;
    }
    if (!subscriptionData) return;
    const { newMeasurement } = subscriptionData
    if (graphData.length !== 0) {
      let newGraphData = graphData.map(item => Object.assign({}, item))
      if (newGraphData[newGraphData.length - 1]['name'] === newMeasurement['at']) {
        newGraphData[newGraphData.length - 1][newMeasurement['metric']] = newMeasurement['value'] as never
      } else {
        newGraphData.shift();
        let newSubscriptionData = {
          name: newMeasurement['at'],
          [newMeasurement['metric']]: newMeasurement['value']
        }
        newGraphData.push(newSubscriptionData as never)
      }
      dispatch(actions.setGraphData(newGraphData))
    }
  }, [subscriptionData, graphData !== []])
  //--------------------------------------------------------------------
  return (
    <div>
      <MetricsInput />
      {selected.length > 0 ? <MetricsGraph /> : null}
    </div>
  )
}
//--------------------------------------------------------------------
const subscriptionClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql', {}
)
//--------------------------------------------------------------------
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});
//--------------------------------------------------------------------
export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};