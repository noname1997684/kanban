import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useBoardStore } from "@/stores/useBoardStore";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const getAnchorRect = () => ref.current!.getBoundingClientRect();
  const { logout } = useUserStore();
  const [searchInput, setSearchInput] = useState<string>("");
  const { boards, setSelectedBoard } = useBoardStore();
  const logoutClick = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };
  const searchClick = () => {
    if (searchInput.trim() === "") {
      alert("Please enter a search term");
      return;
    }
    const foundBoard = boards.find((board) =>
      board.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (foundBoard) {
      setSelectedBoard(foundBoard);
    } else {
      alert("No board found with that name");
    }
  };
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      bg={"transparent"}
      color={{ base: "black", _dark: "white" }}
      p={4}
      mt={2}
      h={12}
    >
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          Kanban
        </Text>
      </Box>
      <Flex alignItems="center" gap={4}>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-md"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button variant="solid" colorScheme="blue" ml={2} onClick={searchClick}>
          Search
        </Button>
      </Flex>
      <Flex alignItems="center" gap={4}>
        {user && user.username ? (
          <Flex align={"center"} justify={"center"} gap={2}>
            <Text>Welcome, {user.username}</Text>
            <Menu.Root positioning={{ getAnchorRect }}>
              <Menu.Trigger asChild>
                <Avatar.Root size={"md"} ref={ref}>
                  <Avatar.Fallback name="Segun Adebayo" />
                  <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      value="nightbutton"
                      alignContent={"center"}
                      justifyContent={"center"}
                    >
                      <ColorModeButton variant="outline" className="ml-4" />
                    </Menu.Item>
                    <Menu.Item value="new-file-a" onClick={logoutClick}>
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            variant="solid"
            colorScheme="blue"
          >
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
