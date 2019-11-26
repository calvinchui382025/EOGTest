import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment';
import { IState, selection } from '../../store';

const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected
}
const getGraphData = (state:IState) => {
  const { graphData } = state.metric
  return graphData;
}

const MetricsGraph = () => {
  const selected = useSelector(getSelected);
  const graphData = useSelector(getGraphData);

  return (
    <LineChart
      width={800}
      height={400}
    data={graphData}
    >
      <Tooltip />
          {
            selected.map((item: selection) => (
              <Line type="monotone" dataKey={item.title} stroke={item.color} />
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
  )
}

export default MetricsGraph