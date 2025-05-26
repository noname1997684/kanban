
import Column from './Column'
import {  Flex } from '@chakra-ui/react'


const Board = () => {
  return (
    <Flex flex={4/5} margin={2} bg={{base:"orange.400",_dark:"orange.700"}} borderRadius={8} padding={4} color='white' gap={4}>
        <Column name="Todo"/>
        <Column name="In Progress"/>
        <Column name="Finished"/>
    </Flex>
  )
}

export default Board