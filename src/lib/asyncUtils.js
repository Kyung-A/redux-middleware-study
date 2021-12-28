// 리덕스 모듈 리팩토링

// Promise에 기반한 Thunk를 만들어주는 함수
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  // 만약 여러 종류의 파라미터를 전달해야한다면 객체 타입의 파라미터를 받아오도록 작성 (지금은 하나만 받는다는 전제)
  return (param) => async (dispatch) => {
    dispatch({ type, param });

    try {
      // 결과물 이름은 payload로 통일
      // 파라미터가 여러개라면? Ex. writeComment({postId: 1, text: '댓글내용'})
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload });
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true });
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

// 비동기 관련 액션들을 처리하는 리듀서
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
