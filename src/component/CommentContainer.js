import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList }) {
  function handleDelete(id) {
    // console.log(id + " 번 댓글 삭제");
    axios.delete("/api/comment/" + id);
  }

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={"4"}>
            {/* TODO: 댓글 작성 후 re render */}
            {commentList.map((comment) => (
              <Box key={comment.id}>
                <Flex justifyContent={"space-between"}>
                  <Heading size={"xs"}>{comment.memberId}</Heading>
                  <Text fontSize={"xs"}>{comment.inserted}</Text>
                </Flex>
                {/* 새로운 줄 출력 */}
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    sx={{ whiteSpace: "pre-wrap" }}
                    pt={"2"}
                    fontSize={"sm"}
                  >
                    {comment.comment}
                  </Text>
                  <Button
                    onClick={() => handleDelete(comment.id)}
                    size={"xs"}
                    colorScheme="red"
                  >
                    <DeleteIcon />
                  </Button>
                </Flex>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </CardHeader>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <Text mt={"10px"} fontSize={"lg"} fontWeight={"bold"}>
        댓글 작성
      </Text>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList boardId={boardId} commentList={commentList} />
    </Box>
  );
}
