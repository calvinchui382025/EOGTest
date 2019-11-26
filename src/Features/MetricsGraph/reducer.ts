import { createSlice, PayloadAction } from 'redux-starter-kit'

export type ApiErrorAction = {
  error: string;
}

export type MetricsSelection = {

}

const initialState = {
  selected: [],
}

const slice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    updateSelected: (state, action) => {
      state.selected = action.payload
      // console.log(state.selected);
    },
    metricsApiErrorAction: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
})

export const reducer = slice.reducer;
export const actions = slice.actions;