import { useBoardStore } from "@/stores/useBoardStore";
import { Button, Container, Flex } from "@chakra-ui/react";
import BoardCard from "./BoardCard";
import { createBoardDialog } from "./dialog/BoardDialog";



const SideBar = () => {
  const { boards } = useBoardStore();
  return (
    <Container
      flex={1 / 5}
      bg={{base:"blue.200",_dark:"blue.700"}}
      borderRadius={8}
      padding={4}
      color="white"
    >
      <Button
        onClick={() => createBoardDialog.open("a", {})}
        colorPalette="blue"
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
      <createBoardDialog.Viewport />
    </Container>
  );
};

export default SideBar;
