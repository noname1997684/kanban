import useShowToast from "@/hooks/useShowToast";
import { useListStore } from "@/stores/useListStore";
import { useTaskStore } from "@/stores/useTaskStore";
import type { ColumnDialogProps } from "@/type/ListInterface";
import type { Task } from "@/type/TaskInterface";
import {
  Button,
  Collapsible,
  createOverlay,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

export const updateListDialog = createOverlay<ColumnDialogProps>((props) => {
  const { listId, name, ...rest } = props;
  const [input, setInput] = useState<string>(name || "");
  const [loading, setLoading] = useState<boolean>(false);
  const { updateList } = useListStore();
  const UpdateList = async () => {
    setLoading(true);
    try {
      await updateList(listId || "", input);
      setInput("");
      updateListDialog.close("a");
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
                  Update List
                </Button>
                <Button
                  variant="solid"
                  colorPalette="gray"
                  ml={2}
                  onClick={() => updateListDialog.close("a")}
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

export const createCardDialog = createOverlay<ColumnDialogProps>((props) => {
  const { listId, ...rest } = props;
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const [aiInput, setAIInput] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardInput, setCardInput] = useState<Task>({
    title: "",
    description: "",
  });
  const { showToast } = useShowToast();
  const { createTask } = useTaskStore();
  const { setLists } = useListStore();
  const addTasks = async () => {
    setLoading(true);
    try {
      const task = await createTask({
        title: cardInput.title,
        description: cardInput.description,
        listId: listId || "",
      });
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
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
              }
            : list
        )
      );
      showToast("Task added successfully", "success");
      createCardDialog.close("a");
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
      showToast("Error generating description: " + error, "error");
      
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
                  border={"1px solid"}
                  borderColor="gray.600"
                  onChange={(e) =>
                    setCardInput({ ...cardInput, title: e.target.value })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Card Description</Field.Label>
                <Collapsible.Root unmountOnExit>
                  <Collapsible.Trigger paddingY="3">
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      bg={"green.600"}
                      padding={2}
                      borderRadius={8}
                      color={"white"}
                    >
                      AI Description
                    </Text>
                  </Collapsible.Trigger>
                  <Collapsible.Content
                    border={"1px solid"}
                    borderColor="gray.600"
                    padding={4}
                    borderRadius={8}
                    bg={{ base: "gray.100", _dark: "gray.800" }}
                  >
                    <Field.Label mb={2}>
                      Write something so the AI can generate a description for
                      you
                    </Field.Label>
                    <Input
                      type="text"
                      border={"1px solid"}
                      borderColor="gray.400"
                      onChange={(e) => setAIInput(e.target.value)}
                      mb={2}
                    />
                    <Button
                      onClick={generateDescription}
                      loading={loadingAI}
                      variant="solid"
                      colorPalette="green"
                    >
                      Generate
                    </Button>
                  </Collapsible.Content>
                </Collapsible.Root>

                <Textarea
                  border={"1px solid"}
                  borderColor="gray.600"
                  value={cardInput.description}
                  onChange={(e) =>
                    setCardInput({ ...cardInput, description: e.target.value })
                  }
                />
              </Field.Root>
              <Flex justifyContent="space-between">
                <Button
                  variant="solid"
                  colorPalette="purple"
                  onClick={addTasks}
                  loading={loading}
                >
                  Add Card
                </Button>
                <Button
                  variant="solid"
                  colorPalette="gray"
                  onClick={() => {
                    createCardDialog.close("a");
                  }}
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
