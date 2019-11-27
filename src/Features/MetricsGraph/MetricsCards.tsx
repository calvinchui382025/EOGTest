import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { IState } from '../../store';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  component: {
    width: 520,
    marginTop: 15
  },
  card: {
    width: 250,
    height: 115,
    margin: 5
  },
  title: {
    fontSize: 14
  },
  value: {
    fontSize: 40
  },
})

const getSelected = (state: IState) => {
  const { selected } = state.metric
  return selected
}
const getGraphData = (state: IState) => {
  const { graphData } = state.metric
  return graphData;
}

const MetricsCards = () => {
  const classes = useStyles();
  const selected = useSelector(getSelected);
  const graphData = useSelector(getGraphData);
  return (
    <div
      className={classes.component}
    >
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
      >
        {
          selected.map((item, i) => (
            <Card
              key={i}
              className={classes.card}
            >
              <CardContent>
                <Typography
                  className={classes.title}
                >
                  {item.title}
                </Typography>
                <Typography
                  className={classes.value}
                >
                  { `${graphData[graphData.length - 2][item.title]}${item.unit}` }
                </Typography>
              </CardContent>
            </Card>
          ))
        }
      </Box>
    </div>
  )
}

export default MetricsCards;