
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
  Textarea
} from "@chakra-ui/react";
import useShowToast from "@/hooks/useShowToast";
import { useState } from "react";
// type của props trong component Column
interface ColumnProps {
  name: string;
  
}
// type của props trong Dialog
interface DialogProps {
  setCardArray: (card: CardProps) => void;
}

interface CardProps {
  id:string
  title: string;
  description: string;
}

const dialog = createOverlay<DialogProps>((props) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const {showToast} = useShowToast()
  const { setCardArray,...rest } = props;
  const [aiInput, setAIInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cardInput, setCardInput] = useState<CardProps>({
    id:"",
    title: "",
    description: "",
  })
  const generateDescription = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: aiInput,
  });
  setCardInput({...cardInput,description:response.text || ""});
      
  console.log(response.text);
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            
              <Dialog.Header>
                <Dialog.Title>
                  Add Card
                </Dialog.Title>
              </Dialog.Header>
            
            <Dialog.Body spaceY="4">
              <Field.Root>
                <Field.Label>
                  Card ID
                </Field.Label>
                <Input type="text" onChange={(e)=>setCardInput({...cardInput,id:e.target.value})}/>
                <Field.Label>
                  Card Title
                </Field.Label>
                <Input type="text" onChange={(e)=>setCardInput({...cardInput,title:e.target.value})}/>
              </Field.Root>
              <Field.Root>
                
                <Field.Label>
                  Card Description
                </Field.Label>
               <Collapsible.Root unmountOnExit>
    <Collapsible.Trigger paddingY="3" >
      <Button colorPalette="teal" variant="solid" size={"sm"}>
        AI Description
      </Button>
    </Collapsible.Trigger>
    <Collapsible.Content border={"1px solid gray"} padding={4} borderRadius={8} bg="gray.700" >
      <Field.Label mb={2}>
        Write something so the AI can generate a description for you
      </Field.Label >
      <Input type="text" onChange={(e)=> setAIInput(e.target.value)} mb={2}/>
      <Button onClick={generateDescription} loading={loading}>Generate</Button>
    </Collapsible.Content>
  </Collapsible.Root>
               
                <Textarea  value={cardInput.description} onChange={(e)=>setCardInput({...cardInput,description:e.target.value})} />
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
                    showToast("Task Added","success")
                    setCardArray(cardInput);
                    console.log(cardInput);
                    dialog.close("a");
                  }}
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

const Column = ({ name }: ColumnProps) => {
  
 const [cardArray, setCardArray] = useState<CardProps[]>(localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name) || "") : []);
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
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {name}
      </Text>
      <Flex flexDirection="column" gap={2}>
        {cardArray.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} id={card.id} name={name} setCardArray={setCardArray}/>
        ))}
      </Flex>
      <Button onClick={() => {
    
     dialog.open("a", {
      setCardArray: (card: CardProps) => {
        setCardArray((prev) => [...prev, card]);
        localStorage.setItem(name, JSON.stringify([...cardArray, card]));
        console.log(cardArray);
      }
          })
  }} mt={4} colorPalette="teal" variant="solid">
        Add Card
      </Button>

    </Box>
    <dialog.Viewport />
    
    </>
  );
};

export default Column;
