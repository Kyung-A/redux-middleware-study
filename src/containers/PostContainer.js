import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Post from "../components/Post";
import { clearPost, getPost } from "../modules/posts";

function PostContainer({ postId }) {
  const { data, loading, error } = useSelector((state) => state.posts.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));

    // useEffect cleanup함수 (함수를 반환)
    return () => {
      dispatch(clearPost());
    };
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
