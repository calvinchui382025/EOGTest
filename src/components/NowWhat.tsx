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
  // card: {
  //   margin: '5% 25%',
  // },
  input: {
    margin: '30',
  }
});
//--------------------------------------------------------------------
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
const query = `

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

  useEffect(() => {
    console.log('Tester');
  },[])

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

// <Card className={classes.card}>
// <CardHeader title="OK, Calvin Chui, you're all setup. Now What?" />
// <CardContent>
//   <List>
//     <ListItem>
//       <Avatar>1</Avatar>
//       <ListItemText primary="Explore the GraphQL API" />
//     </ListItem>
//     <ListItem>
//       <Avatar>2</Avatar>
//       <ListItemText primary="Add ability to select Metrics" />
//     </ListItem>
//     <ListItem>
//       <Avatar>3</Avatar>
//       <ListItemText primary="Display the current metric data" />
//     </ListItem>
//     <ListItem>
//       <Avatar>4</Avatar>
//       <ListItemText primary="Chart historical metric data" />
//     </ListItem>
//     <ListItem>
//       <Avatar>5</Avatar>
//       <ListItemText primary="Submit Your App" />
//     </ListItem>
//   </List>

//   <Typography variant="body1">
//     Remember to refer to our <a href="https://react.eogresources.com/assessing">How We Assess Submissions</a>{' '}
//     guidelines, as well as the <a href="https://react.eogresources.com/api">GraphQL API Documentation</a>.
//   </Typography>
// </CardContent>
// </Card>