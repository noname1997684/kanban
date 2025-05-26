import { Container, Text } from '@chakra-ui/react'


const SideBar = () => {
  return (
    <Container margin={2} flex={1/5} bg='gray.700' borderRadius={8} padding={4} color='white'>
      <Text fontSize='2xl' fontWeight='bold' mb={4}>
        SideBar
      </Text>

    </Container>
  )
}

export default SideBar