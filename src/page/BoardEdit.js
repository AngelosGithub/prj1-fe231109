import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  // /edit/:id
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  // arrow function으로 변환
  // const handleTitleChange = e => {
  //   updateBoard((draft) => {
  //     draft.title = e.target.value;
  //   });
  // };

  // 일반 함수
  // function handleContentChange(e) {
  //   updateBoard((draft) => {
  //     draft.content = e.target.value;
  //   });
  // }
  const handleContentChange = (e) => {
    updateBoard((draft) => {
      draft.content = e.target.value;
    });
  };

  return (
    <Box>
      <h1>{id} 번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.title = e.target.value;
            });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.content = e.target.value;
            });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
          }}
        />
      </FormControl>
      <Button colorScheme="blue">저장</Button>
      {/* 이전 경로로 가기 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
