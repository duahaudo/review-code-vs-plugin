import { Dispatch, createContext } from "react";

export type Action = { type: ACTION; payload: unknown };

export enum ACTION {
  DISPLAY_CODE = "DISPLAY_CODE",
  DISPLAY_REVIEW = "DISPLAY_REVIEW",
  DISPLAY_OPTIMIZE = "DISPLAY_OPTIMIZE",
  SHOW_LOADING = "SHOW_LOADING",
  DISPLAY_OPTIMIZE_STREAM = "DISPLAY_OPTIMIZE_STREAM",
}

export interface State {
  code: string;
  optimize: string;
  review: string;
  loading: boolean;
}

export const initialState: State = {
  code: "",
  optimize: "",
  review: "",
  loading: false,
};

const reducer = (state: State, action: Action) => {
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ state:`, state);
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ ${action.type}:`, action);

  switch (action.type) {
    case ACTION.DISPLAY_CODE: {
      const newState: State = { ...initialState, code: action.payload as string };
      // console.log(
      //   `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ reducer ➡ ACTION.DISPLAY_CODE:`,
      //   newState
      // );
      return newState;
    }
    case ACTION.DISPLAY_OPTIMIZE: {
      return { ...state, optimize: action.payload as string };
    }
    case ACTION.DISPLAY_OPTIMIZE_STREAM: {
      return { ...state, optimize: `${state.optimize}${action.payload as string}` };
    }
    case ACTION.DISPLAY_REVIEW: {
      return { ...state, review: action.payload as string };
    }
    case ACTION.SHOW_LOADING: {
      return { ...state, loading: action.payload as boolean };
    }
    default:
      return state;
  }
};

export default reducer;

export const WebViewContext = createContext<{ state: State; dispatch: Dispatch<Action> }>(
  {} as any
);
