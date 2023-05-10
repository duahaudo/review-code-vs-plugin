import { Dispatch, createContext } from "react";

export type Action = { type: ACTION; payload: string };

export enum ACTION {
  DISPLAY_CODE = 'DISPLAY_CODE',
  DISPLAY_REVIEW = 'DISPLAY_REVIEW',
  DISPLAY_OPTIMIZE = 'DISPLAY_OPTIMIZE'
}

export interface State {
  code: string
  optimize: string
  review: string
}

export const initialState: State = {
  code: "",
  optimize: "",
  review: ""
};

const reducer = (state: State, action: Action) => {
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ state:`, state);
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ ${action.type}:`, action);

  switch (action.type) {
    case ACTION.DISPLAY_CODE: {
      const newState = { ...initialState, code: action.payload }
      console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ ACTION.DISPLAY_CODE:`, newState);
      return newState
    }
    case ACTION.DISPLAY_OPTIMIZE: {
      return { ...state, optimize: action.payload }
    }
    case ACTION.DISPLAY_REVIEW: {
      return { ...state, review: action.payload }
    }
    default:
      return state;
  }
};

export default reducer;

export const WebViewContext = createContext<{ state: State, dispatch: Dispatch<Action> }>({} as any);
