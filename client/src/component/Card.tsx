import useShowToast from "@/hooks/useShowToast";
import { useListStore } from "@/stores/useListStore";
import { useTaskStore } from "@/stores/useTaskStore";
import type { CardDialogProps, Task, CardProps } from "@/type/TaskInterface";
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
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

// Tạo dialog để cập nhật thông tin card
const dialog = createOverlay<CardDialogProps>((props) => {
  const { id, title, description, listId, ...rest } = props;
  const { updateTask } = useTaskStore();
  const { setLists } = useListStore();
  const { showToast } = useShowToast();
  const [cardInput, setCardInput] = useState<Task>({
    title,
    description,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const updateClick = async () => {
    setLoading(true);
    try {
      await updateTask(id, {
        title: cardInput.title,
        description: cardInput.description,
        listId: listId || "",
      });
      console.log(id);
      setLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            const newTasks = (list.tasks || []).map((task) => {
              if (task.id === id) {
                return { ...task, ...cardInput };
              }
              return task;
            });
            return { ...list, tasks: newTasks };
          }
          return list;
        })
      );
      showToast("Card Updated", "success");
      dialog.close("a");
    } catch (error) {
      showToast("Error updating card: " + error, "error");
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
              <Dialog.Title>Update Card </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>Card Title</Field.Label>
                <Input
                  type="text"
                  value={cardInput.title}
                  onChange={(e) =>
                    setCardInput({ ...cardInput, title: e.target.value })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Card Description</Field.Label>

                <Input
                  type="text"
                  value={cardInput.description}
                  onChange={(e) =>
                    setCardInput({ ...cardInput, description: e.target.value })
                  }
                />
              </Field.Root>
              <Flex justifyContent="space-between">
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => {
                    dialog.close("a");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={updateClick}
                >
                  Update Card
                </Button>
                <Button variant="solid" colorScheme="teal">
                  Generate
                </Button>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

const Card = ({ title, description, id, listId, filteredLists }: CardProps) => {
  const { showToast } = useShowToast();
  const { deleteTask, switchList } = useTaskStore();
  const { setLists } = useListStore();
  const deleteCard = async () => {
    try {
      await deleteTask(id);
      setLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            const newTasks = (list.tasks || []).filter(
              (task) => task.id !== id
            );
            return { ...list, tasks: newTasks };
          }
          return list;
        })
      );
      showToast("Card Deleted", "success");
    } catch (error) {
      showToast("Error deleting card: " + error, "error");
    }
  };

  const switchToList = async (newlistId: string) => {
    try {
      await switchList(id, newlistId);
      setLists((prev) => {
        return prev.map((list) => {
          if (list.id === newlistId) {
            return {
              ...list,
              tasks: [
                ...(list.tasks || []),
                { id, title, description, listId: newlistId },
              ],
            };
          }
          if (list.id === listId) {
            return {
              ...list,
              tasks: (list.tasks || []).filter((task) => task.id !== id),
            };
          }
          return list;
        });
      });
      showToast("Card moved to new list", "success");
    } catch (error) {
      showToast("Error moving card: " + error, "error");
    }
  };

  return (
    <Flex
      p={4}
      bg="gray.700"
      borderRadius={8}
      color="white"
      width={"full"}
      height={"fit-content"}
      position={"relative"}
      justifyContent={"space-between"}
      alignItems={"start"}
      gap={2}
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title}
        </Text>
        <Text fontSize="md" mb={2}>
          {description}
        </Text>
      </Box>
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
                    dialog.open("a", {
                      id,
                      title,
                      description,
                      listId,
                    });
                  }}
                >
                  Update
                </Button>
              </Menu.Item>
              <Menu.Item value="new-file-a">
                <Button variant={"ghost"} size={"sm"} onClick={deleteCard}>
                  Delete
                </Button>
              </Menu.Item>
              <Menu.Root positioning={{ placement: "right-start" }}>
                <Menu.TriggerItem>
                  <Button variant={"ghost"} size={"sm"}>
                    Move to
                  </Button>
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {filteredLists.map((list) => (
                        <Menu.Item
                          key={list.id}
                          value={list.id || ""}
                          onClick={() => switchToList(list.id || "")}
                        >
                          {list.name}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <dialog.Viewport />
    </Flex>
  );
};

export default Card;
