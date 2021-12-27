// Ducks 패턴으로 작성

// 액션타입
const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

// 액션 생성함수
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// Redux-Thunk 사용하기
// Thunk는 액션 타입이 함수일 경우 next()가 생략된다
export const increaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(increase()), 1000);
};
export const decreaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(decrease()), 1000);
};

// 초깃값
const initialState = 0;

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
}
