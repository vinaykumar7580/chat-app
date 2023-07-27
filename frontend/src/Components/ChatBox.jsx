import { useEffect, useRef, useState } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import "./Chatbox.css";
import ting from "../Components/Message.mp3";

function ChatBox({ chat, currentUser, setSendMessage, recieveMessage}) {
  const [text, setText] = useState("");
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);

  let scroll = useRef(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (recieveMessage != null && recieveMessage.chatId == chat._id) {
      setMessages([...messages, recieveMessage]);
    }
  }, [recieveMessage]);

  useEffect(() => {
    const userId = chat?.members?.find((el) => el != currentUser);

    const handleNextUser = () => {
      fetch(`http://localhost:8080/user/getuser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (chat != null) {
      handleNextUser();
    }
  }, [chat, currentUser]);

  //fetching data from messages
  useEffect(() => {
    if (chat != null) {
      getMessages();
    }
  }, [chat]);
  const getMessages = () => {
    fetch(`http://localhost:8080/message/${chat._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMessages(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const audio = new Audio(ting);

  const handleChange = (text) => {
    setText(text);
  };

  const handleSend = (e) => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: text,
      chatId: chat._id,
    };

    fetch(`http://localhost:8080/message`, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMessages([...messages, res]);
        setText("");
        audio.play();
      })
      .catch((err) => {
        console.log(err);
      });

    const receiverId = chat?.members?.find((id) => id != currentUser);

    setSendMessage({ ...message, receiverId });
  };

  let date=new Date().toLocaleString()
  date=date.split(",")

  return (
    <>
      {chat != null ? (
        <Box>
          <Box
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
            gap={"20px"}
          >
            <Box width={["20%", "20%", "10%", "7%"]}>
              <Image
                src={
                  userData?.image
                    ? userData?.image
                    : "https://tse1.mm.bing.net/th?id=OIP.hXZi-2Lc_OPdbDXIR_MSNQHaHa&pid=Api&rs=1&c=1&qlt=95&w=122&h=122"
                }
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>{userData && userData?.name}</Text>
              <Text fontWeight={"bold"}>{date[0]}</Text>
            </Box>
          </Box>
          <br />
          <hr style={{ border: "0.1px solid #ececec" }} />
          {/* message.senderId==currentUser? "message own":"message sender" */}
          <Box height={"470px"} className="message-container">
            {messages.map((el) => (
              <Box
                className={
                  el.senderId == currentUser ? "message-own" : "message-sender"
                }
                ref={scroll}
              >
                <Box
                  className="message-box"
                  style={{
                    backgroundColor:
                      el.senderId == currentUser ? "#8500FF" : "#cc00ac",
                  }}
                >
                  <span>{el.text}</span>
                  <br />
                  <span>{format(el.createdAt)}</span>
                </Box>
              </Box>
            ))}
          </Box>
          <hr style={{ border: "0.1px solid #ececec" }} />
          <br />
          {/* chat-sender input */}
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Box width={["250px", "360px", "550px", "680px"]} margin={"auto"}>
              <InputEmoji
                value={text}
                onChange={handleChange}
                placeholder="Type a message"
              />
            </Box>
            <Box>
              <Button colorScheme={"green"} onClick={handleSend}>
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          height={"620px"}
          textAlign={"center"}
          margin={"auto"}
          fontWeight={"bold"}
        >
          Tap to chat....!
        </Box>
      )}
    </>
  );
}
export default ChatBox;
