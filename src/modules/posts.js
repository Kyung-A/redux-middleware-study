import * as postsAPI from "../api/posts"; // 모든 함수 불러오기
import {
  createPromiseThunk,
  createPromiseThunkById,
  handleAsyncActions,
  handleAsyncActionsById,
  reducerUtils,
} from "../lib/asyncUtils";
import { call, put, takeEvery } from "redux-saga/effects";

// 포스트 여러개 조회하기
const GET_POSTS = "GET_POSTS"; // 요청 시작
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; // 요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; //요청 에러

// 포스트 하나 조회하기
const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

// 포스트 조회시 재로딩 문제를 해결하기 위한 포스트 비우기 액션
const CLEAR_POST = "CLEAR_POST";

// redux saga 사용하기
// 액션 생성함수
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({ type: GET_POST, payload: id, meta: id }); // payload는 파라미터 용도(꼭 payload이라고 명칭하지 않아도됨), meta는 리듀서에서 id를 얻기위한 용도

// 제너레이터 함수 (리덕스 사가)
function* getPostsSaga() {
  try {
    const posts = yield call(postsAPI.getPosts); // call을 사용하면 특정 함수를 호출하고, 결과물이 반환 될 때가지 기다려줄 수 있다

    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    }); // 성공 액션 디스패치
  } catch (e) {
    yield put({
      type: GET_POSTS_ERROR,
      error: true,
      payload: e,
    }); // 실패 액션 디스패치
  }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용 가능
// 액션에서 payload 값을 추출하여 API를 호출할때 인자로 넣어서 호출함
// meta 값은 handleAsyncActionsByI를 호환시키기 위함이다
function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;

  try {
    // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 된다
    const post = yield call(postsAPI.getPostById, param);
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id,
    });
  } catch (e) {
    yield put({
      type: GET_POST_ERROR,
      error: true,
      payload: e,
      meta: id,
    });
  }
}

// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

// 포스트 비우기 액션 생성 함수
export const clearPost = () => ({ type: CLEAR_POST });

const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

// 리듀서
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, "posts", true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionsById(GET_POST, "post", true)(state, action);
    default:
      return state;
  }
}

// 3번째 인자를 사용하면 withExtraArgument(index.js)에서 넣어준 값들을 사용할 수 있음
export const goToHome =
  () =>
  (dispatch, getState, { history }) => {
    history.push("/");
  };
