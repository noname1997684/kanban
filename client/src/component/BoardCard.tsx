import { useBoardStore } from "@/stores/useBoardStore";
import type { BoardCardProps } from "@/type/BoardInterface";
import { Box, Text } from "@chakra-ui/react";

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
      boxShadow={"sm"}
      padding={2}
      _hover={{ _light:{bg:"blue.500"},_dark:{bg: "gray.900"}, cursor: "pointer", color: "white" }}
      _dark={
        board.id !== selectedBoard?.id
          ? { borderColor: "gray.600", bg: "blackAlpha.400" }
          : { borderColor: "gray.200", bg: "gray.900" }
      }
      _light={
        board.id !== selectedBoard?.id
          ? { bg: "white", color:"gray.800" }
          : { bg: "blue.500", color: "white", borderColor: "black",borderWidth:"2px" }
      }
      onClick={changeBoard}
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
      
      >
        {board.name}
      </Text>
    </Box>
  );
};

export default BoardCard;
