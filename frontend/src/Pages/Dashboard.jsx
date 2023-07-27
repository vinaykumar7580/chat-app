import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import { Search2Icon } from "@chakra-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Conversation from "../Components/Conversation";
import ChatBox from "../Components/ChatBox";
import { io } from "socket.io-client";
import * as Scroll from "react-scroll";
import "../Components/Chatbox.css";

function Dashboard() {
  // const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [show, setShow] = useState("A");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

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
  console.log("onlineuser", onlineUsers);
  const checkOnlineStatus = (chat) => {
    const chatMembers = chat.members.find((member) => member != user._id);
    const online = onlineUsers.find((user) => user.userId == chatMembers);
    return online ? true : false;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("search", search);

    fetch(`http://localhost:8080/user/allUsers?name=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        //console.log("searchresult",res)
        setSearchResult(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setSearch("");
  };

  const handleAddChat=(id)=>{
    let payload={
      senderId:user._id,
      receiverId:id
    }

    fetch(`http://localhost:8080/chat`,{
      method:"POST",
      body:JSON.stringify(payload),
      headers:{
        "Content-Type":"application/json"
      }

    })
    .then((res) => res.json())
      .then((res) => {
        //console.log("searchresult",res)
        handleGetChat()
        
      })
      .catch((err) => {
        console.log(err);
      });
      setSearchResult([])

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
                <Input
                  placeholder="Search User"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button colorScheme={"blue"} onClick={handleSearch}>
                  <Search2Icon />
                </Button>
              </Box>
              <br />
              {searchResult.length > 0 ? (
                <Box>
                  {searchResult &&
                    searchResult?.map((el) => (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={"10px"}
                        textAlign={"left"}
                        padding={"20px"}
                        cursor={"pointer"}
                        boxShadow="lg"
                        rounded="md"
                        bg="white"
                        onClick={()=>handleAddChat(el._id)}
                      >
                        <Box width={["15%","15%","15%","15%"]}>
                          <Image
                            src={
                              el.image
                                ? el.image
                                : "https://tse1.mm.bing.net/th?id=OIP.hXZi-2Lc_OPdbDXIR_MSNQHaHa&pid=Api&rs=1&c=1&qlt=95&w=122&h=122"
                            }
                          />
                        </Box>
                        <Box>
                          <Text fontWeight={"bold"}>{el.name}</Text>
                        </Box>
                      </Box>
                    ))}
                </Box>
              ) : (
                ""
              )}
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

                <Box height={"470px"} className="message-container">
                  {chats.map((el) => (
                    <Box onClick={() => setCurrentChat(el)} cursor={"pointer"}>
                      <Conversation
                        key={el._id}
                        data={el}
                        userId={user._id}
                        online={checkOnlineStatus(el)}
                      />
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
