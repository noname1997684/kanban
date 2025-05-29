import { useBoardStore } from "@/stores/useBoardStore";
import type { BoardCardProps } from "@/type/BoardInterface";
import { Box, Button, Text } from "@chakra-ui/react";






const BoardCard = ({ board }: BoardCardProps) => {
  const { setSelectedBoard, selectedBoard } = useBoardStore();
  const changeBoard = () => {
    setSelectedBoard(board);
  };
  return (
    <Box
      border={"1px solid"}
      borderColor="gray.300"
      borderRadius="md"
      padding={4}
      _hover={{ bg: "gray.900", cursor: "pointer", color: "black" }}
      _dark={
        board.id !== selectedBoard?.id
          ? { borderColor: "gray.600", bg: "gray.700" }
          : { borderColor: "gray.600", bg: "gray.900" }
      }
      onClick={changeBoard}
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        color="gray.800"
        _dark={{ color: "white" }}
      >
        {board.name}
      </Text>
    </Box>
  );
};

export default BoardCard;
