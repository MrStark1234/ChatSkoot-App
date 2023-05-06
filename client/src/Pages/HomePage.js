import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabPanels,
  TabList,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        background={"#2c232925"}
        width="100%"
        margin="50px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" color={"white"}>
          ChatSkoot-App
        </Text>
      </Box>
      <Box
        background="#ebebfc25"
        width="100%"
        padding={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded" colorScheme="cyan">
          <TabList marginBottom="1em">
            <Tab width="50%" color="white">
              Login
            </Tab>
            <Tab width="50%" color="white">
              Register
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
