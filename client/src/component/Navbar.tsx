import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useBoardStore } from "@/stores/useBoardStore";
import useShowToast from "@/hooks/useShowToast";
import { FaSearch } from "react-icons/fa";
const Navbar = () => {
  // sửa dùng useUserStore để lấy user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const getAnchorRect = () => ref.current!.getBoundingClientRect();
  const { logout } = useUserStore();
  const [searchInput, setSearchInput] = useState<string>("");
  const { boards, setSelectedBoard } = useBoardStore();
  const { showToast } = useShowToast();
  const logoutClick = () => {
    logout();
    setSelectedBoard(null);
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
      showToast("Board not found", "error");
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
      <Flex alignItems="center" gap={2}>
        <Input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-md"
          w={["100%", "300px", "400px"]}
          border={"1px solid"}
          borderColor="blue.200"
          h={8}
          bg={{ base: "white", _dark: "gray.700" }}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <IconButton
          variant="solid"
          colorPalette="blue"
          w={10}
          h={10}
          rounded={"full"}
          onClick={searchClick}
        >
          <FaSearch />
        </IconButton>
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
