import React from "react";
import { useParams } from "react-router-dom";

import PostContainer from "../containers/PostContainer";

function PostPage() {
  const { postId } = useParams();

  // 문자열을 숫자로 변환
  return <PostContainer postId={parseInt(postId, 10)} />;
}

export default PostPage;
