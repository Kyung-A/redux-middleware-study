import axios from "axios";

// n 밀리세켄드동안 기다리는 프로미스를 만들어주는 함수
// const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

// 비동기함수
export const getPosts = async () => {
  try {
    const data = await axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then(function (response) {
        return response.data;
      });

    return data;
  } catch (error) {
    console.log(error);
  }
};

// id로 조회하는 비동기 함수
export const getPostById = async (id) => {
  try {
    const data = await axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(function (response) {
        return response.data;
      });

    return data;
  } catch (error) {
    console.log(error);
  }
};
