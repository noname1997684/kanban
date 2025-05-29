import Navbar from "./component/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Container, Flex } from "@chakra-ui/react";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
function App() {
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Flex
      flexDirection="column"
      position={"relative"}
      w={"full"}
      h={"100vh"}
      bg={{ base: "white", _dark: "gray.800" }}
    >
      {pathname !== "/login" && <Navbar />}
      <Container
        maxW="100%"
        bg={{ base: "white", _dark: "gray.800" }}
        color="black"
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </Container>
      <Toaster />
    </Flex>
  );
}

export default App;
