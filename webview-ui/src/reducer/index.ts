import { Dispatch, createContext } from "react";
import { Uri } from "vscode";

export enum LOCAL_STORAGE_KEY {
  "local-state" = `stiger-review-code-local-state`,
}

export type Action = { type: ACTION; payload: unknown };

export enum ACTION {
  RELOAD_DATA = "RELOAD_DATA",
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
  fileName: string;
  uri: Uri | null;
}

export const initialState: State = {
  code: "",
  optimize: "",
  review: "",
  loading: false,
  fileName: "",
  uri: null,
};

const executeReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.RELOAD_DATA: {
      const localState = localStorage.getItem(LOCAL_STORAGE_KEY["local-state"]);
      const newState = localState ? (JSON.parse(localState) as State) : state;
      return { ...state, ...newState };
    }
    case ACTION.DISPLAY_CODE: {
      localStorage.removeItem(LOCAL_STORAGE_KEY["local-state"]);
      const { selection, fileName, uri } = action.payload as {
        selection: string;
        fileName: string;
        uri: Uri;
      };
      const newState: State = {
        ...state,
        optimize: "",
        review: "",
        code: selection,
        fileName,
        uri,
      };
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

const reducer = (state: State, action: Action) => {
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BEFORE:`, state);
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ ACTION ➡ ${action.type}:`, action);
  const newState = executeReducer(state, action);
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ AFTER:`, newState);
  localStorage.setItem(LOCAL_STORAGE_KEY["local-state"], JSON.stringify(newState));
  return newState;
};

export default reducer;

export const WebViewContext = createContext<{ state: State; dispatch: Dispatch<Action> }>(
  {} as any
);
