import Column from "./Column";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useListStore } from "@/stores/useListStore";
import { useEffect, useState } from "react";
import { useBoardStore } from "@/stores/useBoardStore";
import useShowToast from "@/hooks/useShowToast";
import { createListDialog, updateBoardDialog } from "./dialog/BoardDialog";
import ComponentMenu from "./menu/ComponentMenu";

const Board = () => {
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const { lists, getListByBoardId, setLists } = useListStore();
  const { selectedBoard } = useBoardStore();
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
        showToast("Error fetching lists: " + error, "error");
        setLoadingList(false);
      });
  }, [selectedBoard, getListByBoardId]);
 

  if (loadingList)
    return (
      <Flex
        flex={4 / 5}
        backgroundImage={{
          _dark:
            "linear-gradient(117deg,rgba(100, 54, 143, 1) 0%, rgba(194, 107, 166, 1) 100%)",
          base: "linear-gradient(117deg,rgba(152, 107, 194, 1) 0%, rgba(230, 131, 198, 1) 100%)",
        }}
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
        backgroundImage={{
          _dark:
            "linear-gradient(117deg,rgba(100, 54, 143, 1) 0%, rgba(194, 107, 166, 1) 100%)",
          base: "linear-gradient(117deg,rgba(152, 107, 194, 1) 0%, rgba(230, 131, 198, 1) 100%)",
        }}
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
      backgroundImage={{
        _dark:
          "linear-gradient(117deg,rgba(100, 54, 143, 1) 0%, rgba(194, 107, 166, 1) 100%)",
        base: "linear-gradient(117deg,rgba(152, 107, 194, 1) 0%, rgba(230, 131, 198, 1) 100%)",
      }}
      borderRadius={8}
      gap={2}
      color="white"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        bg={"blackAlpha.400"}
        p={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {selectedBoard.name}
        </Text>
        <ComponentMenu component="board" />
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
            variant={{ base: "outline", _dark: "solid" }}
            color={{ base: "white", _dark: "gray.800" }}
            _hover={{ color: "gray.800" }}
            colorPalette={"gray"}
            fontWeight={"bold"}
            onClick={() => createListDialog.open("a", {})}
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
            variant={{ base: "outline", _dark: "solid" }}
            color={{ base: "white", _dark: "gray.800" }}
            _hover={{ color: "gray.800" }}
            colorPalette={"gray"}
            fontWeight={"bold"}
            onClick={() => createListDialog.open("a", {})}
          >
            Add List
          </Button>
        </Flex>
      )}

      <createListDialog.Viewport />
      <updateBoardDialog.Viewport />
    </Flex>
  );
};

export default Board;
