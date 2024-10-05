import React, { useEffect } from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom';

const Homepage = () => {

  // const history = useHistory();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("userInfo"));

  //   if (user) history.push("/chats");
  // }, [history]);



   return <Container>  

  <Box 
    d = "flex"    // display
    justifyContent= "center"
    p = {3}       // padding 
    //bg = {"white"}  // background 
    w = "100%"      // width
    m = "40px 0 15px 0"   // margin 
    borderRadius = "1g"
    borderWidth = "1px"

  >    {/* this is just a chakra version of div, but we can directly write css over here*/}

      <Text fontSize= "4xl" fontFamily= "Work sans" textAlign= "center" color= "white"> Chat Application</Text>
  </Box >


  <Box w = "100%" p = {4} borderRadius = "1g" borderWidth= "1px">

      <Tabs variant='soft-rounded'>   {/*just tabs from chakraUI */}
      
      <TabList >
          <Tab width = "50%" color= "white" fontFamily="Work sans">Login</Tab>
          <Tab width = "50%" color= "white" fontFamily="Work sans">Sign up</Tab>
        </TabList>

        <TabPanels>
        
        <TabPanel>   <Login/> </TabPanel>
        <TabPanel>   <Signup/></TabPanel>

        </TabPanels>

      </Tabs>



  </Box>
  
 
  </Container>;
}

export default Homepage