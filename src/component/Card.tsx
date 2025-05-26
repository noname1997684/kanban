import useShowToast from "@/hooks/useShowToast";
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

interface ICard {
  id: string;
  title: string;
  description: string;
}
interface CardProps {
  id: string;
  name: string;
  title: string;
  description: string;
  setCardArray: React.Dispatch<React.SetStateAction<ICard[]>>;
}
interface DialogProps {
  id: string;
  title: string;
  description: string;
  setCardArrayInput: (card: ICard) => void;
}
const dialog = createOverlay<DialogProps>((props) => {
  const { setCardArrayInput, title, description, id, ...rest } = props;
  const [cardInput, setCardInput] = useState<ICard>({
    id,
    title,
    description,
  });
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Update Card {cardInput.id}</Dialog.Title>
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
                  variant="solid"
                  colorScheme="teal"
                  onClick={() => {
                    console.log("Card added");
                    setCardArrayInput(cardInput);
                    console.log(cardInput);
                    dialog.close("a");
                  }}
                >
                  Update Card
                </Button>
                 <Button variant="solid" colorScheme="teal">Generate</Button>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

const Card = ({ title, description, setCardArray, id, name }: CardProps) => {
  const { showToast } = useShowToast();
  const deleteCard = () => {
    setCardArray((prevCards) => {
      const updateCard = prevCards.filter((card) => card.title !== title);
      localStorage.setItem(name, JSON.stringify(updateCard));
      return updateCard;
    });
    showToast("Card Deleted", "error");
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
          <IconButton aria-label="Search database" variant="ghost" color={"white"} >
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
                      setCardArrayInput: (card: ICard) => {
                        setCardArray((prev) => {
                          const updateCard = prev.map((c) => {
                            if (c.id === card.id) {
                              return card;
                            }
                            return c;
                          });
                          localStorage.setItem(
                            name,
                            JSON.stringify(updateCard)
                          );
                          return updateCard;
                        });
                        showToast("Card Updated", "success");
                      },
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
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <dialog.Viewport />
    </Flex>
  );
};

export default Card;
