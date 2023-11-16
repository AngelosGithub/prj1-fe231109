import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIgloo,
  faPenToSquare,
  faPersonWalkingArrowRight,
  faRightFromBracket,
  faRightToBracket,
  faUserGear,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  // 세션이 서버에 있기때문에 클라이언트에서 사용하기 위해 쓰는 코드
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();

  if (login !== "") {
    urlParams.set("id", login.id);
  }

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
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faIgloo} />
        home
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>
          <FontAwesomeIcon icon={faPenToSquare} />
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>
          <FontAwesomeIcon icon={faRightToBracket} />
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faUsers} />
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faUserGear} />
          회원정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} />
          Login
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </Button>
      )}
    </Flex>
  );
}
