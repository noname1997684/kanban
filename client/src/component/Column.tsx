import Card from "./Card";
import { GoogleGenAI } from "@google/genai";
import {
  Box,
  Button,
  Flex,
  Text,
  Dialog,
  Portal,
  createOverlay,
  Input,
  Field,
  Collapsible,
  Textarea,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import useShowToast from "@/hooks/useShowToast";
import { useState } from "react";
import { useTaskStore } from "@/stores/useTaskStore";
import { useListStore } from "@/stores/useListStore";
import { BsThreeDots } from "react-icons/bs";
import type { ColumnDialogProps, ColumnProps } from "@/type/ListInterface";
import type { Task } from "@/type/TaskInterface";

const updateDialog = createOverlay<ColumnDialogProps>((props) => {
  const { listId, ...rest } = props;
  const { updateList } = useListStore();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const UpdateList = async () => {
    setLoading(true);
    try {
      await updateList(listId || "", input);
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

const dialog = createOverlay<ColumnDialogProps>((props) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const { showToast } = useShowToast();
  const { listId, ...rest } = props;
  const { createTask } = useTaskStore();
  const { setLists } = useListStore();
  const [aiInput, setAIInput] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardInput, setCardInput] = useState<Task>({
    title: "",
    description: "",
  });

  const addTasks = async () => {
    setLoading(true);
    try {
      const task = await createTask({
        title: cardInput.title,
        description: cardInput.description,
        listId: listId || "",
      });
      setLists((prev) => {
        const updatedLists = prev.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: [
                ...(list.tasks || []),
                {
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  listId: task.listId,
                },
              ],
            };
          }
          return list;
        });
        console.log("Updated Lists:", updatedLists);
        return updatedLists;
      });
      showToast("Task added successfully", "success");
      dialog.close("a");
      setCardInput({ title: "", description: "" });
    } catch (error) {
      showToast("Error adding task" + error, "error");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    setLoadingAI(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: aiInput,
      });
      setCardInput({ ...cardInput, description: response.text || "" });
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Card</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input
                  onChange={(e) =>
                    setCardInput({ ...cardInput, title: e.target.value })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Card Description</Field.Label>
                <Collapsible.Root unmountOnExit>
                  <Collapsible.Trigger paddingY="3">
                    <Text fontSize="lg" fontWeight="bold">
                      AI Description
                    </Text>
                  </Collapsible.Trigger>
                  <Collapsible.Content
                    border={"1px solid gray"}
                    padding={4}
                    borderRadius={8}
                    bg="gray.700"
                  >
                    <Field.Label mb={2}>
                      Write something so the AI can generate a description for
                      you
                    </Field.Label>
                    <Input
                      type="text"
                      onChange={(e) => setAIInput(e.target.value)}
                      mb={2}
                    />
                    <Button onClick={generateDescription} loading={loadingAI}>
                      Generate
                    </Button>
                  </Collapsible.Content>
                </Collapsible.Root>

                <Textarea
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
                  variant="solid"
                  colorScheme="teal"
                  onClick={addTasks}
                  loading={loading}
                >
                  Add Card
                </Button>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

const Column = ({ name, listId }: ColumnProps) => {
  const { lists, deleteList } = useListStore();
  const { tasks } = lists.find((list) => list.id === listId) || { tasks: [] };
  const { showToast } = useShowToast();
  const filteredLists = lists.filter((list) => list.id !== listId);

  const deleteClick = async () => {
    try {
      await deleteList(listId || "");
      showToast("List deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting list: " + error, "error");
    }
  };
  return (
    <>
      <Box
        p={4}
        bg="gray.800"
        borderRadius={8}
        w={"33%"}
        height={"fit-content"}
        color="white"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {name}
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
                          listId: listId,
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
            dialog.open("a", {
              listId: listId,
            });
          }}
          mt={4}
          colorPalette="teal"
          variant="solid"
        >
          Add Card
        </Button>
      </Box>
      <dialog.Viewport />
      <updateDialog.Viewport />
    </>
  );
};

export default Column;
