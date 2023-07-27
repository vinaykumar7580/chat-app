import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import { Search2Icon } from "@chakra-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Conversation from "../Components/Conversation";
import ChatBox from "../Components/ChatBox";
import { io } from "socket.io-client";

function Dashboard() {
  // const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [show, setShow] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);

  const socket = useRef();

  useEffect(() => {
    const handleGetUser = () => {
      fetch(`http://localhost:8080/user/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    handleGetUser();
  }, []);

  useEffect(() => {
    handleGetChat();
  }, [user]);

  const handleGetChat = () => {
    fetch(`http://localhost:8080/chat/${user._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setChats(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log("receivemessage",recieveMessage)
  useEffect(() => {
    socket.current = io("http://localhost:8800");

    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //sending message to socket server
  useEffect(() => {
    if (sendMessage != null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //receive message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log("receive", data);
      setRecieveMessage(data);
    });
  }, []);
  //console.log("recieveMessage", recieveMessage);
  console.log("onlineuser",onlineUsers)
  const checkOnlineStatus=(chat)=>{
    const chatMembers=chat.members.find((member)=>member!=user._id)
    const online=onlineUsers.find((user)=>user.userId==chatMembers)
    return online? true:false
  }

  return (
    <Box background={"linear-gradient(60deg,#cc00ac,#8500FF)"}>
      {/* background={"linear-gradient(60deg,#cc00ac,#8500FF)"} */}
      <Navbar />

      <Tabs variant="unstyled">
        <Box
          bg={"#FFFFFF"}
          padding={"10px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <TabList>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap="10px"
            >
              <Tab
                _selected={{
                  color: "white",
                  bg: "blue.500",
                  borderRadius: "100px",
                  fontWeight: "bold",
                }}
                fontWeight={"bold"}
              >
                Chats
              </Tab>
              <Tab
                _selected={{
                  color: "white",
                  bg: "green.400",
                  borderRadius: "100px",
                  fontWeight: "bold",
                }}
                fontWeight={"bold"}
              >
                Messages
              </Tab>
              <Tab
                _selected={{
                  color: "white",
                  bg: "orange.400",
                  borderRadius: "100px",
                  fontWeight: "bold",
                }}
                fontWeight={"bold"}
              >
                Status
              </Tab>
            </Box>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel>
            {/* <p>one!</p> */}
            <Box
              width={["100%", "100%", "70%", "30%"]}
              margin={"auto"}
              padding={"20px"}
              boxShadow="lg"
              p="5"
              rounded="md"
              bg="white"
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Input placeholder="Search User" />
                <Button colorScheme={"blue"}>
                  <Search2Icon />
                </Button>
              </Box>
              <br />
              <Box
                textAlign={"left"}
                boxShadow="lg"
                p="5"
                rounded="md"
                bg="white"
              >
                <Heading size={"md"}>Chats</Heading>
                <br />
                <Box height={"470px"}>
                  {chats.map((el) => (
                    <Box onClick={() => setCurrentChat(el)} cursor={"pointer"}>
                      <Conversation key={el._id} data={el} userId={user._id} online={checkOnlineStatus(el)} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            {/* <p>two!</p> */}
            <Box
              boxShadow="lg"
              p="6"
              rounded="md"
              bg="white"
              textAlign={"left"}
              width={["100%", "100%", "90%", "60%"]}
              margin={"auto"}
            >
              <Box>
                <ChatBox
                  chat={currentChat}
                  currentUser={user._id}
                  setSendMessage={setSendMessage}
                  recieveMessage={recieveMessage}
                 
                />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              boxShadow="lg"
              p="6"
              rounded="md"
              bg="white"
              fontWeight={"bold"}
              height={"80vh"}
              width={["100%", "100%", "100%", "40%"]}
              margin={"auto"}
            >
              We will be working on it...!
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <br />
    </Box>
  );
}
export default Dashboard;
