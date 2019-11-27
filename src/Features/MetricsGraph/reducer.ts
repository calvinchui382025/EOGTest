import { createSlice, PayloadAction } from 'redux-starter-kit'
//--------------------------------------------------------------------
export type ApiErrorAction = {
  error: string;
}
//--------------------------------------------------------------------
export type MetricsSelection = {
  title: string,
  color: string,
  unit: string
}
//--------------------------------------------------------------------
const initialState = {
  selections: [
    { title: 'injValveOpen', color: '#56ff00', unit: "%" },
    { title: 'oilTemp', color: '#ff8d00', unit: "F" },
    { title: 'tubingPressure', color: '#00f9ff', unit: "PSI" },
    { title: 'flareTemp', color: '#E14343', unit: "F" },
    { title: 'casingPressure', color: '#fd00ff', unit: "PSI" },
    { title: 'waterTemp', color: '#0004FF', unit: "F" },
  ],
  selected: [] as MetricsSelection[],
  graphData: [],
}
//--------------------------------------------------------------------
const slice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    updateSelected: (state, action) => {
      state.selected = action.payload
    },
    setGraphData: (state, action) => {
      state.graphData = action.payload
    },
    metricsApiErrorAction: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
})
//--------------------------------------------------------------------
export const reducer = slice.reducer;
export const actions = slice.actions;