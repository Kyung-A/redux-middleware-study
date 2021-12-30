import * as postsAPI from "../api/posts"; // 모든 함수 불러오기
import {
  createPromiseSaga,
  createPromiseSagaById,
  handleAsyncActions,
  handleAsyncActionsById,
  reducerUtils,
} from "../lib/asyncUtils";
import { takeEvery, getContext } from "redux-saga/effects";

// 포스트 여러개 조회하기
const GET_POSTS = "GET_POSTS"; // 요청 시작
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; // 요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; //요청 에러

// 포스트 하나 조회하기
const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

// (saga) 홈으로 이동하는 액션
const GO_TO_HOME = "GO_TO_HOME";

// 포스트 조회시 재로딩 문제를 해결하기 위한 포스트 비우기 액션
const CLEAR_POST = "CLEAR_POST";

// redux saga 사용하기
// 액션 생성함수
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({ type: GET_POST, payload: id, meta: id }); // payload는 파라미터 용도(꼭 payload이라고 명칭하지 않아도됨), meta는 리듀서에서 id를 얻기위한 용도
export const goToHome = () => ({ type: GO_TO_HOME });

// sage 함수 리팩토링
// 간단한 로직은 saga 함수를 직접 작성하는 것보다는 유틸함수로 새로운 사가를 손쉽게 만들어서 쓰는게 좋다
const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);

function* goToHomeSaga() {
  const history = yield getContext("history");
  history.push("/");
}

// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
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
// export const goToHome =
//   () =>
//   (dispatch, getState, { history }) => {
//     history.push("/");
//   };
