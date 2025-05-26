import { Flex, Text } from '@chakra-ui/react'
import { ColorModeButton } from "@/components/ui/color-mode"

const Navbar = () => {
  return (
    <Flex justifyContent={'space-between'} alignItems='center' bg={"transparent"} color={{base:"black",_dark:"white"}} p={4} h={12}>
      <div>
        <Text fontSize='2xl' fontWeight='bold'>Kanban</Text>
      </div>
      <div>
        <input type="text" placeholder='Search...' className='p-2 rounded-md' />
      </div>
      <Flex alignItems='center' gap={4}>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>Login</button>
        <ColorModeButton variant="outline" className='ml-4' />
      </Flex>

    </Flex>
  )
}

export default Navbar
