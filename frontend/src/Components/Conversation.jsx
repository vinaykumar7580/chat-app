import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./Chatbox.css";

function Conversation({ data, userId,online }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const nextid = data.members.find((id) => id !== userId);
    console.log(nextid);

    const handleNextUser = () => {
      fetch(`http://localhost:8080/user/getuser/${nextid}`, {
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
    handleNextUser();
  }, []);

  //console.log("next",userData)

  return (
    <Box >
      <br />
      <Box
        display={"flex"}
        justifyContent={"left"}
        alignItems={"center"}
        gap={"20px"}
        
      >
        <Box width={"15%"}>
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
          <Text fontWeight={"bold"} color={online? "green":"black"}>{online? "Online":"Offline"}</Text>
        </Box>
      
      </Box>
      <br />
      <hr style={{ border: "0.1px solid #ececec" }} />
    </Box>
  );
}
export default Conversation;
