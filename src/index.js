import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./modules";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";

import { createBrowserHistory } from "history";
import { HistoryRouter } from "./HistoryRouter";

// Thunk를 이용한 라우터 연동
// getState()를 사용하여 현재 리덕스 스토어의 상태를 확인하여 조건부로 이동하거나
// 특정 API를 호출하여 성공 시에만 이동하는 형식 구현이 가능하다
const history = createBrowserHistory();

// 여러개의 미들웨어 등록 가능 (myLogger, logger)
const store = createStore(
  rootReducer,
  // logger를 사용하는 경우 logger가 마지막순에 있어야함
  composeWithDevTools(
    applyMiddleware(ReduxThunk.withExtraArgument({ history: history }), logger)
  )
);

ReactDOM.render(
  <HistoryRouter history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </HistoryRouter>,
  document.getElementById("root")
);
