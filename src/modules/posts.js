import * as postsAPI from "../api/posts"; // 모든 함수 불러오기
import { createPromiseThunk, reducerUtils } from "../lib/asyncUtils";

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
// export const getPosts = () => async (dispatch) => {
//   dispatch({ type: GET_POSTS });

//   try {
//     const posts = await postsAPI.getPosts(); // API 호출
//     dispatch({ type: GET_POSTS_SUCCESS, posts });
//   } catch (e) {
//     dispatch({ type: GET_POSTS_ERROR, error: e });
//   }
// };
// thunk 함수에서도 파라미터를 받아와서 사용할 수 있습니다
// export const getPost = (id) => async (dispatch) => {
//   dispatch({ type: GET_POST });

//   try {
//     const post = await postsAPI.getPostById(id);
//     dispatch({ type: GET_POST_SUCCESS, post });
//   } catch (e) {
//     dispatch({ type: GET_POST_ERROR, error: e });
//   }
// };

// 위 주석처리된 Thunk 함수들 리팩토링
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

// 기본 상태
// const initialState = {
//   posts: {
//     loading: false,
//     data: null,
//     error: null,
//   },
//   post: {
//     loading: false,
//     data: null,
//     error: null,
//   },
// };
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

// 리듀서
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        // posts: {
        //   loading: true,
        //   data: null,
        //   error: null,
        // },
        posts: reducerUtils.loading(),
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        // posts: {
        //   loading: true,
        //   data: action.posts,
        //   error: null,
        // },
        posts: reducerUtils.success(action.payload),
      };
    case GET_POSTS_ERROR:
      return {
        ...state,
        // posts: {
        //   loading: true,
        //   data: null,
        //   error: action.error,
        // },
        posts: reducerUtils.error(action.error),
      };
    case GET_POST:
      return {
        ...state,
        // post: {
        //   loading: true,
        //   data: null,
        //   error: null,
        // },
        post: reducerUtils.loading(),
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        // post: {
        //   loading: true,
        //   data: action.post,
        //   error: null,
        // },
        post: reducerUtils.success(action.payload),
      };
    case GET_POST_ERROR:
      return {
        ...state,
        // post: {
        //   loading: true,
        //   data: null,
        //   error: action.error,
        // },
        post: reducerUtils.error(action.error),
      };
    default:
      return state;
  }
}
