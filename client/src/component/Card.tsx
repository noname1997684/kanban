import type { CardProps } from "@/type/TaskInterface";
import { Box, Flex, Text } from "@chakra-ui/react";

import { updateCardDialog } from "./dialog/CardDialog";
import ComponentMenu from "./menu/ComponentMenu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ title, description, id, listId }: CardProps) => {
   const sortableId = `${listId}:${id}`; 
  const {attributes,listeners,setNodeRef,transform,transition}= useSortable({id: sortableId, data: { listId, cardId: id }});
  const style = {
    transition,
    
    transform:CSS.Transform.toString(transform),
    zIndex: 1000,
  }
  
  return (
    <Flex
      p={4}
      bg={{ base: "white", _dark: "gray.600" }}
      boxShadow={"md"}
      borderRadius={8}
      color={{ base: "gray.800", _dark: "white" }}
      width={"full"}
      height={"fit-content"}
      position={"relative"}
      justifyContent={"space-between"}
      alignItems={"start"}
      gap={2}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}

    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title}
        </Text>
        <Text fontSize="md" mb={2}>
          {description}
        </Text>
      </Box>
      <ComponentMenu component="card" cardId={id} listId={listId} />
      <updateCardDialog.Viewport />
    </Flex>
  );
};

export default Card;
