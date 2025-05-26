import React from 'react'
import { GoogleGenAI } from "@google/genai";
import { Button, Container, Text, Textarea } from '@chakra-ui/react';
const Test = () => {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const generatePrompt = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
  });
  setOutput(response.text ?? "");
      
  console.log(response.text);
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container margin={2} flex={1/5} bg='gray.700' borderRadius={8} padding={4} color='white'>
      <Textarea
      placeholder='Type your message here...'
      value={input}
      onChange={(e) => setInput(e.target.value)}

      />
      <Button onClick={generatePrompt} loading={loading}>Generate</Button>
      {output && (
        <Text>
          {output}
        </Text>
      )}
      </Container>
  )
}

export default Test