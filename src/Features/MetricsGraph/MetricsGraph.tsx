import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment';
import { IState, selection } from '../../store';
//--------------------------------------------------------------------
const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected
}
const getGraphData = (state: IState) => {
  const { graphData } = state.metric
  return graphData;
}
//--------------------------------------------------------------------
const ID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}
//--------------------------------------------------------------------
const MetricsGraph = () => {
  const selected = useSelector(getSelected);
  const graphData = useSelector(getGraphData);
  //--------------------------------------------------------------------
  return (
    <LineChart
      width={850}
      height={400}
      data={graphData}
    >
      <Tooltip />
      {
        selected.map((item: selection, i: number) => (
          <Line
            type="monotone"
            key={i}
            dataKey={item.title}
            stroke={item.color}
            yAxisId={item.unit}
          />
        ))
      }
      <XAxis
        dataKey="name"
        domain={['auto', 'auto']}
        interval={230}
        tickFormatter={(tick) => moment(tick).format('HH:mm')}
        type='number'
        scale='time'
      />
      {
        selected.map((item: selection) => (
          <YAxis
            yAxisId={item.unit}
            key={ID()}
            type="number"
            unit={item.unit}
            scale='auto'
            domain={[0, 'auto']}
          />
        ))
      }
    </LineChart>
  )
}
export default MetricsGraph;