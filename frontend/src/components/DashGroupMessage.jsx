import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "flowbite-react";
import { AuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { useSearchParams } from "react-router-dom";

export const DashGroupMessage = () => {
  const { authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocketContext();
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (searchParams.get("dash") === "all") {
          var res = await fetch(`/api/v1/message/getgroup/${authUser._id}/all`);
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "all-message",
              createdBy: authUser.id,
            }),
          });
        }
        if (searchParams.get("dash") === "message-group") {
          var res = await fetch(
            `/api/v1/message/getgroup/${authUser._id}/${authUser.pStation}`
          );
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "message-group",
              createdBy: authUser.id,
            }),
          });
        }
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setMessages([]);
        } else {
          setMessages(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [searchParams]);

  //authUser, searchParams

  console.log(messages);

  // Scroll to bottom when new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== authUser._id) {
          if (searchParams.get("dash") === newMessage.station) {
            setMessages((messages) => [...messages, newMessage]);
          }
          if (
            searchParams.get("dash") === "message-group" &&
            newMessage.station === authUser.pStation
          ) {
            setMessages((messages) => [...messages, newMessage]);
          }
        }
      });
      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket]);

  const sendMessage = async () => {
    try {
      if (newMessage.trim()) {
        if (searchParams.get("dash") === "all") {
          var res = await fetch(`/api/v1/message/send/${authUser._id}/all`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage }),
          });
        } else {
          var res = await fetch(
            `/api/v1/message/send/${authUser._id}/${authUser.pStation}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: newMessage }),
            }
          );
        }
        // const res = await fetch(
        //   `/api/v1/message/send/${authUser._id}/${authUser.pStation}`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ message: newMessage }),
        //   }
        // );
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setNewMessage("");
          return;
        }
        if (res.ok) {
          setMessages((messages) => [...messages, data]);
          setNewMessage("");
        }
      }
    } catch (error) {
      setNewMessage("");
      console.log(error);
    }
  };
  console.log(messages.length);
  console.log(authUser?._id);

  return (
    <div className="flex flex-col h-screen ">
      <div className="flex-grow overflow-y-auto p-4 ">
        {authUser &&
          messages.length !== 0 &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex items-start my-2 ${
                message.senderId === authUser?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.senderId !== authUser?._id && (
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 ">
                    <img className="rounded-full" src={message.senderImage} />
                  </div>
                </div>
              )}

              {/* 66f9a9f9bb2cf7ce10e1a857 */}
              <div
                className={`p-3 rounded-lg ${
                  message.senderId === authUser?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <div className="font-bold">{message.senderName}</div>
                <div>{message.message}</div>
              </div>
              {message.senderId === authUser?._id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-8 h-8 ">
                    <img className="rounded-full" src={message.senderImage} />
                  </div>
                </div>
              )}
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-white flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:border-blue-500"
          placeholder="Type here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};
