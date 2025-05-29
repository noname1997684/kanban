
import useShowToast from "@/hooks/useShowToast";
import { useUserStore } from "@/stores/useUserStore";
import type { AuthInput } from "@/type/UserInterface";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





const LoginPage = () => {
    const {showToast} = useShowToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {loginState,setLoginState}= useUserStore();
    const {setUser} = useUserStore();
    const [input, setInput] = useState<AuthInput>({
    username: "",
    email: "",
    password: "",
    })
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (loginState === "login") {
        // Handle login logic
        if (!input.email || !input.password) {
            showToast("Please fill in all fields", "error");
            return;
        }
        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });
            const data = await res.json();
            
           
            setUser(data.user);
            navigate("/")
            showToast(data.message, "success");
        } catch (error) {
            showToast("An error occurred while logging in", "error");
        } finally {
            setIsLoading(false);
        }
       

    }
    if (loginState === "signup") {
        if (!input.username || !input.email || !input.password) {
        showToast("Please fill in all fields", "error");
        return;
        
    }
    try {
        const res= await fetch('/api/user/register',{
            method: 'POST', 
            
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })
        const data = await res.json();

        
        setUser(data.user);
        navigate("/");
        showToast(data.message, "success");
    } catch (error) {
        showToast("An error occurred while signing up", "error");
    } finally{
        setIsLoading(false);
    }
    }
   
}

  return (
    <Flex align="center" justify="center" h="100vh">
      <Stack gap={4} mx={"auto"} maxW={"lg"} py={12} px={6} >
        <Stack align="center">
          <Heading
            fontSize="4xl"
            textAlign="center"
            color={{ base: "black", _dark: "white" }}
          >
           {loginState!=="login"? "Sign Up":"Login"}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={{ base: "gray.800", _dark: "gray.700" }}

          boxShadow="lg"
          p={8}
          w={{ base: "full", md: "md" }}
        >
          <Stack gap={4}>
            <form>
            <VStack gap={4} w="full">
              
                {loginState !=="login" && <Field.Root required>
                  <Field.Label color={{ base: "black", _dark: "white" }}>
                    Username
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input  onChange={(e)=>setInput({...input,username:e.target.value})}/>
                </Field.Root>}
                <Field.Root required>
                  <Field.Label color={{ base: "black", _dark: "white" }}>
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input placeholder="me@example.com" onChange={(e)=>setInput({...input,email:e.target.value})}/>
                </Field.Root>
                <Field.Root required>
                  <Field.Label color={{ base: "black", _dark: "white" }}>
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input onChange={(e)=>setInput({...input,password:e.target.value})}/>
                </Field.Root>
                <Text textAlign="start" w={"full"} color="gray.500">
                    {loginState!=="login"? "Already have an account?": "Don't have an account?"}{" "}
                    <strong className="hover:cursor-pointer text-green-500" onClick={() => setLoginState(loginState!=="login" ? "login" : "signup")}>
                      {loginState!=="login"? "Login here": "Sign Up here"}
                    </strong>
                </Text>
                <HStack justifyContent="center" w="full">
                    <Button type="submit" onClick={handleSubmit} loading={isLoading}>
                        {loginState!=="login"? "Sign Up":"Login"}
                    </Button>
                   
                </HStack>
             
            </VStack>
             </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
