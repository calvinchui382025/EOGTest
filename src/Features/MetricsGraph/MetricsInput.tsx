import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
//--------------------------------------------------------------------
import { actions } from './reducer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { IState, selection } from '../../store';
//--------------------------------------------------------------------
const useStyles = makeStyles({
  input: {
    margin: 25,
    width: 850,
  },
  inputRoot: {
    flexWrap: "nowrap"
  }
})
//--------------------------------------------------------------------
const getSelections = (state: IState) => {
  const { selections } = state.metric
  return selections;
}
//--------------------------------------------------------------------
const MetricsInput = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selections = useSelector(getSelections);
  const handleChangeSelected = (_event: React.ChangeEvent<{}>, values: selection[]) => {
    dispatch(actions.updateSelected(values))
  }
  return (
    <Autocomplete
      className={classes.input}
      classes={{
        inputRoot: classes.inputRoot
      }}
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
  )
}
export default MetricsInput