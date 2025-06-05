import useShowToast from "@/hooks/useShowToast";
import { useListStore } from "@/stores/useListStore";
import { useTaskStore } from "@/stores/useTaskStore";
import type { CardDialogProps, Task } from "@/type/TaskInterface";
import { Button, Collapsible, createOverlay, Dialog, Field, Flex, Input, Portal, Text, Textarea } from "@chakra-ui/react";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

export const updateCardDialog = createOverlay<CardDialogProps>((props) => {
  const { id, title, description, listId, ...rest } = props;
   const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
   const [loadingAI, setLoadingAI] = useState<boolean>(false);
   const [ loading,setLoading] = useState<boolean>(false);
   const [aiInput, setAIInput] = useState<string>("");
   const [cardInput, setCardInput] = useState<Task>({
     title,
     description,
    });
    const { showToast } = useShowToast();
    const { setLists } = useListStore();
    const { updateTask } = useTaskStore();

  const updateClick = async () => {
    setLoading(true);
    try {
      await updateTask(id, {
        title: cardInput.title,
        description: cardInput.description,
        listId: listId || "",
      });

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks?.map((task) =>
                task.id === id ? { ...task, ...cardInput } : task
                ),
              }
            : list
        )
      );
      showToast("Card Updated", "success");
      updateCardDialog.close("a");
    } catch (error) {
      showToast("Error updating card: " + error, "error");
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
              <Dialog.Title>Update Card </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>Card Title</Field.Label>
                <Input
                border="1px solid"
                borderColor="gray.600"
                  type="text"
                  value={cardInput.title}
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
                border="1px solid"
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
                  onClick={updateClick}
                  loading={loading}
                >
                  Update Card
                </Button>
                <Button
                   variant="solid"
                  colorPalette="gray"
                  onClick={() => {
                    updateCardDialog.close("a");
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