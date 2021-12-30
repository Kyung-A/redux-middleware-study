import { call, put } from "redux-saga/effects";

// 프로미스를 기다렸다가 결과를 디스패치하는 사가
export const createPromiseSaga = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return function* sgsa(action) {
    try {
      // 재사용성을 위하여 promiseCreator의 파라미터엔 action.payload 값을 넣음
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload });
    } catch (e) {
      yield put({ type: ERROR, error: true, payload: e });
    }
  };
};

// 특정 id의 데이터를 조회하는 용도로 사용하는 사가
// API를 호출할때 파라미터는 action.payload를 넣고, id 값을 action.meta로 설정한다
export const createPromiseSagaById = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return function* saga(action) {
    const id = action.meta;

    try {
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      yield put({ type: ERROR, error: e, meta: id });
    }
  };
};

// 리듀서에서 사용 할 수 있는 여러 유틸 함수
export const reducerUtils = {
  // 초기상태, 초기 data 값은 기본적으로 null이지만 바꿀 수도 있음
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
  }),
  // 로딩중의 prevState의 경우엔 기본값 null이지만 따로 값을 지정하면 null로 바구지 않고 다른 값 유지 가능
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null,
  }),
  // 성공시 실행될 함수
  success: (payload) => ({
    loading: false,
    data: payload,
    error: null,
  }),
  // 에러시 실행될 함수
  error: (error) => ({
    lading: false,
    data: null,
    error: error,
  }),
};

// 비동기 관련 액션들을 처리하는 리듀서 (유틸함수)
// type = 액션 타입, key = 상태의 key(posts, post)
export const handleAsyncActions = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          // [key]: reducerUtils.loading(),
          [key]: reducerUtils.loading(keepData ? state[key].data : null), // keepData 라는 파라미터를 추가 -> 만약 이 값이 true로 주어지면 로딩을 할 때에도 데이터를 유지
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload),
        };
      default:
        return state;
    }
  };
};

// id별로 처리하는 리듀서 (유틸함수)
export const handleAsyncActionsById = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return (state, action) => {
    const id = action.meta;

    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              // 유효성 검사
              keepData ? state[key][id] && state[key][id].data : null
            ),
          },
        };
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload),
          },
        };
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload),
          },
        };
      default:
        return state;
    }
  };
};
