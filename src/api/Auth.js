/*
서버와 실제 통신하는 부분
로그인 정보를 서버로 보내고 응답을 받음
마치 호텔 직원이 고객의 신분증을 확인하는 것과 같은 역할
*/

import api from "./index";

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};
