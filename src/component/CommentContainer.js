import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

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

function CommentItem({ comment, onDeleteModalOpen }) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size={"xs"}>{comment.memberId}</Heading>
        <Text fontSize={"xs"}>{comment.inserted}</Text>
      </Flex>
      {/* 새로운 줄 출력 */}
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
          {comment.comment}
        </Text>
        {hasAccess(comment.memberId) && (
          <Button
            onClick={() => onDeleteModalOpen(comment.id)}
            size={"xs"}
            colorScheme="red"
          >
            <DeleteIcon />
          </Button>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={"4"}>
            {/* TODO: 댓글 작성 후 re render */}
            {commentList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDeleteModalOpen={onDeleteModalOpen}
              />
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
  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 값을 임시로 저장함
  const commentIdRef = useRef(0);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

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
      .then(() => {
        toast({
          description: "댓글이 등록되었습니다",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "댓글 등록중 문제가 발생했습니다",
          status: "warning",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    // console.log(id + " 번 댓글 삭제");
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "삭제 되었습니다",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.res.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제중 문제가 발생했습니다",
            status: "warning",
          });
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }

  function handleDeleteModalOpen(id) {
    // 아이디를 어딘가 저장
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }
  return (
    <Box>
      <Text mt={"10px"} fontSize={"lg"} fontWeight={"bold"}>
        댓글 작성
      </Text>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
