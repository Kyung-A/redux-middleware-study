import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./modules";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";

// 여러개의 미들웨어 등록 가능 (myLogger, logger)
const store = createStore(
  rootReducer,
  // logger를 사용하는 경우 logger가 마지막순에 있어야함
  composeWithDevTools(applyMiddleware(ReduxThunk, logger))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
