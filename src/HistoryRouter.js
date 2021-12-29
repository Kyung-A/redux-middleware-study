import React, { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

// children 파라미터가 없으면 node가 렌더링 되지 않음
export function HistoryRouter({ children, history }) {
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  // history.listen 이란
  // 위치 변경 수신을 시작하고 업데이트가 있을때 지정된 콜백을 호출
  // 여기에선 history가 바뀌면 action과 location을 업데이트 해줌
  //
  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
