import * as postsAPI from "../api/posts"; // 모든 함수 불러오기
import {
  createPromiseThunk,
  handleAsyncActions,
  reducerUtils,
} from "../lib/asyncUtils";

// 프로미스를 다루는 리덕스 모듈을 다룰때 고려해야하는 사항
// 1. 프로미스가 시작, 성공, 실패했을때 다른 액션을 디스패치
// 2. 각 프로미스마다 thunk 함수를 만들어줘야한다
// 3. 리듀서에서 액션에 따라 로딩중, 결과, 에러 상태를 변경해주어야 합니다

// 포스트 여러개 조회하기
const GET_POSTS = "GET_POSTS"; // 요청 시작
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; // 요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; //요청 에러

// 포스트 하나 조회하기
const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

// thunk를 사용할때 꼭 모든 액션들에 대하여 액션 생섬함수를 만들필요 없이 바로 thunk 함수 안에서 만들어도됨
// Thunk 함수들 리팩토링
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

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
      // const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
      // return postsReducer(state, action);
      // 위 주석을 간단히 하면
      return handleAsyncActions(GET_POSTS, "posts", true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActions(GET_POST, "post")(state, action);
    default:
      return state;
  }
}
