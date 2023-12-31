import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  const { fetchLogin } = useContext(LoginContext);

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "로그인 되었습니다",
          status: "info",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그인 정보를 다시 확인해주세요",
          status: "warning",
        });
      });
  }

  return (
    <Box>
      <h1>로그인</h1>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}
