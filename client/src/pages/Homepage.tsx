import Board from "@/component/Board";
import SideBar from "@/component/SideBar";
import { useBoardStore } from "@/stores/useBoardStore";
import { useUserStore } from "@/stores/useUserStore";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

const Homepage = () => {
  const { getBoardsByUserId } = useBoardStore();
  const { user } = useUserStore();
  useEffect(() => {
    if (user && user.id) {
      getBoardsByUserId(user.id);
    }
  }, [getBoardsByUserId, user]);

  return (
    <Flex
      flexDirection="row"
      w="full"
      h="90vh"
      bg={{ base: "white", _dark: "gray.800" }}
      color="black"
      gap={4}
      padding={2}
    >
      <SideBar />

      <Board />
    </Flex>
  );
};

export default Homepage;
