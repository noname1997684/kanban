import Card from "./Card";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useListStore } from "@/stores/useListStore";
import type { ColumnProps } from "@/type/ListInterface";
import { createCardDialog, updateListDialog } from "./dialog/ListDialog";
import ComponentMenu from "./menu/ComponentMenu";
const Column = ({ name, listId }: ColumnProps) => {
  const { lists } = useListStore();
  const { tasks = [] } = lists.find((list) => list.id === listId) || {};
  
  const filteredLists = lists.filter((list) => list.id !== listId);

  return (
    <>
      <Box
        p={4}
        bg={{ base: "gray.200", _dark: "gray.800" }}
        borderRadius={8}
        w={"33%"}
        height={"fit-content"}
        color={{ base: "gray.800", _dark: "white" }}
        boxShadow="md"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {name}
          </Text>
          <ComponentMenu component="list" listId={listId} />
        </Flex>
        <Flex flexDirection="column" gap={2}>
          

          {tasks.map((task, index) => (
            <Card
            id={task.id || ""}
            key={index}
            title={task.title}
            description={task.description}
            listId={listId || ""}
            filteredLists={filteredLists}
            />
          ))}
         
        </Flex>
        <Button
          onClick={() => {
            createCardDialog.open("a", {
              listId: listId,
            });
          }}
          mt={4}
          colorPalette="purple"
          variant="subtle"
          width="full"
        >
          Add Card
        </Button>
      </Box>
      <createCardDialog.Viewport />
      <updateListDialog.Viewport />
    </>
  );
};

export default Column;
