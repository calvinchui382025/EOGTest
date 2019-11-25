import { createSlice, PayloadAction } from 'redux-starter-kit'

export type ApiErrorAction = {
  error: string;
}

export type MetricsSelection = {

}

const initialState = ['']

const slice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    updateSelection: (state, action) => {
      state = action.payload
      console.log(state);
    },
    metricsApiErrorAction: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
})

export const reducer = slice.reducer;
export const actions = slice.actions;