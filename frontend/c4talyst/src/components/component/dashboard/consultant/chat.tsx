"use client";

import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Chat() {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Financial Advisor",
      content:
        "Hello, what can I help you with? For your convenience, I will be granted access to any of your resources when relevant.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const chatContainerRef = useRef(null);

  const handleAddMessage = (message: any) => {
    if (message === "") return;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch("http://35.83.115.56/llm/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.accessToken}`,
        },
        body: JSON.stringify({ messages }), // Sending the whole messages array
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data1 = await response.text();
      const data = JSON.parse(data1);
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: "Financial Advisor",
          content: JSON.parse(data)['response'],
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("There was an error sending the message:", error);
    }
  };

  // Call handleSendMessage when a new user message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "You") {
      handleSendMessage();
    }
  }, [messages]); 

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen flex-col">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container"
        ref={chatContainerRef}
        style={{ paddingBottom: '4rem' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 text-sm ${
                message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="font-medium">{message.sender}</div>
              <div>{message.content}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/20 p-4 border-t" style={{ position: 'sticky', bottom: 0 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMessage(e.target.message.value);
            e.target.message.value = "";
          }}
          className="flex items-center gap-2"
        >
          <Input name="message" placeholder="Type your message..." className="flex-1" />
          <Button type="submit">
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}