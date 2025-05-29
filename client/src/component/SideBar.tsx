import { useBoardStore } from "@/stores/useBoardStore";
import { Button, Container, Flex } from "@chakra-ui/react";
import BoardCard from "./BoardCard";
import { createOverlay, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import type { BoardDialogProps } from "@/type/BoardInterface";

const dialog = createOverlay<BoardDialogProps>((props) => {
  const { ...rest } = props;
  const { createBoard } = useBoardStore();
  const [input, setInput] = useState<string>("");
  const { user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const AddBoard = async () => {
    setLoading(true);
    if (!input) {
      alert("Please enter a list name");
      return;
    }
    try {
      if (!user) {
        alert("User not found. Please log in.");
        return;
      }
      await createBoard(input, user.id);
      setInput("");
      dialog.close("a");
    } catch (error) {
      console.error("Error creating board:", error);
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
                <Input onChange={(e) => setInput(e.target.value)} />
              </Field.Root>
              <Flex>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  onClick={AddBoard}
                  loading={loading}
                >
                  Add Board
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
const SideBar = () => {
  const { boards } = useBoardStore();
  return (
    <Container
      flex={1 / 5}
      bg="gray.700"
      borderRadius={8}
      padding={4}
      color="white"
    >
      <Button
        onClick={() => dialog.open("a", {})}
        colorScheme="teal"
        width="full"
        variant="solid"
      >
        Create New Board
      </Button>
      <Flex flexDirection="column" gap={2} marginTop={4}>
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </Flex>
      <dialog.Viewport />
    </Container>
  );
};

export default SideBar;
