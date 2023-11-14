import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../App";

export function NavBar() {
  // 세션이 서버에 있기때문에 클라이언트에서 사용하기 위해 쓰는 코드
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>write</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>signup</Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>회원목록</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>Login</Button>
      )}
      {isAuthenticated() && <Button onClick={handleLogout}>Logout</Button>}
    </Flex>
  );
}
