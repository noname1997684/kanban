import { Button, IconButton, Menu, Portal } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { updateBoardDialog } from "../dialog/BoardDialog";
import { useBoardStore } from "@/stores/useBoardStore";
import { useListStore } from "@/stores/useListStore";
import useShowToast from "@/hooks/useShowToast";
import type { MenuInterface } from "@/type/MenuInterface";
import { updateListDialog } from "../dialog/ListDialog";
import { useTaskStore } from "@/stores/useTaskStore";
import { updateCardDialog } from "../dialog/CardDialog";
import type { Task } from "@/type/TaskInterface";

const ComponentMenu = ({ component, listId,cardId }: MenuInterface) => {
  const { selectedBoard, deleteBoard, setSelectedBoard } = useBoardStore();
  const { deleteList, lists,setLists } = useListStore();
  const {deleteTask,switchList} = useTaskStore();
  const list = lists.find((list) => list.id === listId);
  const task = list?.tasks?.find((task) => task.id === cardId);
  
  const { showToast } = useShowToast();
  const filteredLists = lists.filter((list) => list.id !== listId);
  const deleteClick = async () => {
    try {
      switch (component) {
        case "board": {
          await deleteBoard(selectedBoard?.id || "");
          setSelectedBoard({
            id: "",
            name: "",
            userId: "",
            lists: [],
          });
          setLists([]);
          showToast("List deleted successfully", "success");
          break;
        }
        case "list": {
          await deleteList(listId || "");
          showToast("List deleted successfully", "success");
          break;
        }
        case "card": {
            await deleteTask(cardId || "");
      setLists((prev) =>
        prev.map((list) => (
          list.id === listId
            ? {
                ...list,
                tasks: (list.tasks || []).filter((task) => task.id !== cardId),
              }
            : list
          
        ))
      );
      showToast("Card Deleted", "success");
            break;
        }
      }
    } catch (error) {
      switch (component) {
        case "board":
          showToast("Error deleting board: " + error, "error");
          break;
        case "list":
          showToast("Error deleting list: " + error, "error");
          break;
        case "card":
            showToast("Error deleting card: " + error, "error");
            break;
      }
    }
  };
  const switchToList = async (newlistId: string) => {
      try {
        await switchList(cardId || "", newlistId);
      
         setLists((prev) => {
      let movedTask: Task | undefined;

      const updatedLists = prev.map((list) => {
        if (list.id === listId) {
          const originalTasks = list.tasks || [];
          movedTask = originalTasks.find((t) => t.id === cardId);
          return {
            ...list,
            tasks: originalTasks.filter((t) => t.id !== cardId),
          };
        }
        return list;
      });

      const updatedMovedTask: Task = {
        ...movedTask,
        listId: newlistId,
        title: movedTask?.title ?? "",
        description: movedTask?.description ?? "",
      };

      return updatedLists.map((list) =>
        list.id === newlistId
          ? {
              ...list,
              tasks: [...(list.tasks || []), updatedMovedTask],
            }
          : list
      );
    });
        showToast("Card moved to new list", "success");
        console.log("Card moved to new list", lists);
      } catch (error) {
        showToast("Error moving card: " + error, "error");
      }
    };
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Search database"
          variant="ghost"
          rounded={"full"}
          _hover={{ bg: "blackAlpha.400" }}
          _active={{ bg: "blackAlpha.500" }}
          _focus={{ boxShadow: "none" }}
          color={"white"}
        >
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
                  switch (component) {
                    case "board": {
                      updateBoardDialog.open("a", {
                        boardId: selectedBoard?.id || "",
                        name: selectedBoard?.name,
                      });
                      break;
                    }
                    case "list": {
                      updateListDialog.open("a", {
                        listId: listId,
                        name: list?.name,
                      });
                      break;
                    }
                    case "card": {
                        updateCardDialog.open("a", {
                      id: cardId || "",
                      title: task?.title || "",
                      description: task?.description || "",
                      listId,
                    });
                        break;
                    }
                  }
                }}
              >
                Update
              </Button>
            </Menu.Item>
            <Menu.Item value="new-file-a">
              <Button variant={"ghost"} size={"sm"} onClick={deleteClick}>
                Delete
              </Button>
            </Menu.Item>
            {component === "card" && (
                   <Menu.Root positioning={{ placement: "right-start" }}>
                <Menu.TriggerItem>
                  <Button variant={"ghost"} size={"sm"}>
                    Move to
                  </Button>
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {filteredLists.map((list) => (
                        <Menu.Item
                          key={list.id}
                          value={list.id || ""}
                          onClick={() => switchToList(list.id || "")}
                        >
                          {list.name}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ComponentMenu;
