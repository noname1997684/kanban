import useShowToast from "@/hooks/useShowToast";
import { useBoardStore } from "@/stores/useBoardStore";
import { useListStore } from "@/stores/useListStore";
import { useUserStore } from "@/stores/useUserStore";
import type { BoardDialogProps } from "@/type/BoardInterface";
import {
  Button,
  createOverlay,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";

export const updateBoardDialog = createOverlay<BoardDialogProps>((props) => {
  const { boardId, name, ...rest } = props;
  const [input, setInput] = useState<string>(name || "");
  const [loading, setLoading] = useState<boolean>(false);
  const { updateBoard, setBoards, setSelectedBoard } = useBoardStore();

  const UpdateList = async () => {
    setLoading(true);
    try {
      const board = await updateBoard(boardId || "", input);
      setInput("");
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId ? { ...board, name: input } : board
        )
      );
      setSelectedBoard(board);
      updateBoardDialog.close("a");
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
              <Dialog.Title>Update Board </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>Board name</Field.Label>
                <Input
                  border={"1px solid"}
                  borderColor="gray.600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorPalette="purple"
                  onClick={UpdateList}
                  loading={loading}
                >
                  Update Board
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  ml={2}
                  onClick={() => updateBoardDialog.close("a")}
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
export const createListDialog = createOverlay<BoardDialogProps>((props) => {
  const { ...rest } = props;
  const [input, setInput] = useState<string>("");
  const [createListLoading, setCreateListLoading] = useState<boolean>(false);
  const { selectedBoard, setBoards } = useBoardStore();
  const { createList } = useListStore();
  const AddList = async () => {
    setCreateListLoading(true);
    if (!input) {
      alert("Please enter a list name");
      return;
    }
    try {
      const list = await createList(input, selectedBoard?.id || "");
      setBoards((prev) =>
        prev.map((board) =>
          board.id === selectedBoard?.id
            ? { ...board, lists: [...board.lists, list] }
            : board
        )
      );
      setInput("");
      createListDialog.close("a");
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
                <Input
                  onChange={(e) => setInput(e.target.value)}
                  border={"1px solid"}
                  borderColor="gray.600"
                />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorPalette="purple"
                  onClick={AddList}
                  loading={createListLoading}
                >
                  Add List
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  ml={2}
                  onClick={() => createListDialog.close("a")}
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
export const createBoardDialog = createOverlay<BoardDialogProps>((props) => {
  const { ...rest } = props;
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { createBoard } = useBoardStore();
  const { user } = useUserStore();
  const {showToast} = useShowToast();
  const AddBoard = async () => {
    setLoading(true);
    if (!input) {
      showToast("Please enter a board name", "error");
      return;
    }
    try {
      if (!user) {
       showToast("You must be logged in to create a board", "error");
        return;
      }
      await createBoard(input, user.id);
      setInput("");
      createBoardDialog.close("a");
    } catch (error) {
      showToast("Error creating board: "+ error , "error");
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
              <Dialog.Title>Add Board </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>Board name</Field.Label>
                <Input
                  onChange={(e) => setInput(e.target.value)}
                  border={"1px solid"}
                  borderColor="gray.200"
                />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorPalette="blue"
                  onClick={AddBoard}
                  loading={loading}
                >
                  Add Board
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  ml={2}
                  onClick={() => createBoardDialog.close("a")}
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
