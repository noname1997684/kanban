import Column from "./Column";
import {
  Box,
  Button,
  createOverlay,
  Dialog,
  Field,
  Flex,
  IconButton,
  Input,
  Menu,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useListStore } from "@/stores/useListStore";
import { useEffect, useState } from "react";
import { useBoardStore } from "@/stores/useBoardStore";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "@/hooks/useShowToast";
import type { BoardDialogProps } from "@/type/BoardInterface";



const updateDialog = createOverlay<BoardDialogProps>((props) => {
  const { boardId, ...rest } = props;
  const { updateBoard } = useBoardStore();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const UpdateList = async () => {
    setLoading(true);
    try {
      await updateBoard(boardId || "", input);
      setInput("");
      updateDialog.close("a");
    } catch (error) {
      console.error("Error updating list:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Update List </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>List name</Field.Label>
                <Input onChange={(e) => setInput(e.target.value)} />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  onClick={UpdateList}
                  loading={loading}
                >
                  Update List
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  ml={2}
                  onClick={() => dialog.close("a")}
                >
                  Cancel
                </Button>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

const dialog = createOverlay<BoardDialogProps>((props) => {
  const { ...rest } = props;
  const { createList } = useListStore();
  const [input, setInput] = useState<string>("");
  const { selectedBoard, setBoards } = useBoardStore();
  const [createListLoading, setCreateListLoading] = useState<boolean>(false);
  const AddList = async () => {
    setCreateListLoading(true);
    if (!input) {
      alert("Please enter a list name");
      return;
    }
    try {
      await createList(input, selectedBoard?.id || "");
      setBoards((prev) => {
        const updatedBoards = [...prev];
        const boardIndex = updatedBoards.findIndex(
          (board) => board.id === selectedBoard?.id
        );
        if (boardIndex !== -1) {
          updatedBoards[boardIndex].lists.push({
            name: input,
            id: Date.now().toString(),
            tasks: [],
          });
        }
        return updatedBoards;
      });
      setInput("");
      dialog.close("a");
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setCreateListLoading(false);
    }
  };
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add List </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>List name</Field.Label>
                <Input onChange={(e) => setInput(e.target.value)} />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  onClick={AddList}
                  loading={createListLoading}
                >
                  Add List
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  ml={2}
                  onClick={() => dialog.close("a")}
                >
                  Cancel
                </Button>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
const Board = () => {
  const { lists, getListByBoardId, setLists } = useListStore();
  const { selectedBoard, deleteBoard, setSelectedBoard } = useBoardStore();
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const { showToast } = useShowToast();
  useEffect(() => {
    setLoadingList(true);
    if (!selectedBoard) {
      setLoadingList(false);
      return;
    }
    setLists([]);
    getListByBoardId(selectedBoard.id || "")
      .then(() => setLoadingList(false))
      .catch((error) => {
        console.error("Error fetching lists:", error);
        setLoadingList(false);
      });
  }, [selectedBoard, getListByBoardId]);
  const deleteClick = async () => {
    try {
      await deleteBoard(selectedBoard?.id || "");
      setSelectedBoard({
        id: "",
        name: "",
        userId: "",
        lists: [],
      });
      setLists([]);
      showToast("List deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting list: " + error, "error");
    }
  };

  if (loadingList)
    return (
      <Flex
        flex={4 / 5}
        bg={{ base: "orange.400", _dark: "orange.700" }}
        borderRadius={8}
        padding={4}
        color="white"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Flex>
    );
  if (!selectedBoard || selectedBoard.id === "")
    return (
      <Flex
        flex={4 / 5}
        bg={{ base: "orange.400", _dark: "orange.700" }}
        borderRadius={8}
        padding={4}
        color="white"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <h1>Select a board to view its lists</h1>
        </Box>
      </Flex>
    );

  return (
    <Flex
      flexDirection={"column"}
      flex={4 / 5}
      bg={{ base: "orange.400", _dark: "orange.700" }}
      borderRadius={8}
      gap={2}
      color="white"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        bg={"gray.500"}
        p={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {selectedBoard.name}
        </Text>
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton
              aria-label="Search database"
              variant="ghost"
              color={"white"}
            >
              <BsThreeDots />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="new-txt-a">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      updateDialog.open("a", {
                        boardId: selectedBoard.id || "",
                      });
                    }}
                  >
                    Update
                  </Button>
                </Menu.Item>
                <Menu.Item value="new-file-a">
                  <Button variant={"ghost"} size={"sm"} onClick={deleteClick}>
                    Delete
                  </Button>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      {lists.length === 0 ? (
        <Flex
          gap={4}
          overflowX="auto"
          padding={4}
          justifyContent="center"
          alignItems="center"
          h={"100%"}
        >
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={() => dialog.open("a", {})}
          >
            Add List
          </Button>
          <Box>
            <h1>No lists found for this board</h1>
          </Box>
        </Flex>
      ) : (
        <Flex gap={4} overflowX="auto" padding={4}>
          {lists.map((list) => (
            <Column name={list.name} listId={list.id} />
          ))}
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={() => dialog.open("a", {})}
          >
            Add List
          </Button>
        </Flex>
      )}

      <dialog.Viewport />
    </Flex>
  );
};

export default Board;
