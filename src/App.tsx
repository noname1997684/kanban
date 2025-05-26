
import Navbar from './component/Navbar'
import SideBar from './component/SideBar'
import Board from './component/Board'
import { Toaster } from './components/ui/toaster'
import {  Flex } from '@chakra-ui/react'
function App() {
  
  return (
    <Flex flexDirection="column" height="100vh" bg={{base:"white",_dark:"gray.800"}} color="white">
     <Navbar/>
     <main className='flex flex-1'>
      <SideBar/>
      <Board/>
      <Toaster />
     </main>
    
    </Flex>
  )
}

export default App
