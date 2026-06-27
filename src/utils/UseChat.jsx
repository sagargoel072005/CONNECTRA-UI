import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";

export const useChat = (targetUserId) => {
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  // ── Fetch target user info directly from profile ──
  const fetchTargetUser = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/${targetUserId}`, {
        withCredentials: true,
      });
      const u = res.data?.user ?? res.data;
      setTargetUser({
        firstName: u.firstName,
        lastName: u.lastName,
        photoUrl: u.photoUrl,
      });
    } catch (err) {
      console.error("Error fetching target user:", err);
    }
  }, [targetUserId]);

  useEffect(() => {
    if (targetUserId) fetchTargetUser();
  }, [targetUserId, fetchTargetUser]);

  // ── Fetch chat messages ──
  const fetchChatMessages = useCallback(async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const msgs = chat?.data?.messages ?? [];

      const chatMessages = msgs.map(({ senderId, text, createdAt, fileUrl, fileType }) => ({
        senderId: senderId?._id,
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt,
        fileUrl,
        fileType,
      }));

      setMessages(chatMessages);
      setTimeout(() => scrollToBottom("auto"), 100);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  }, [targetUserId, scrollToBottom, userId]);

  useEffect(() => {
    if (targetUserId) fetchChatMessages();
  }, [targetUserId, fetchChatMessages]);

  // ── Socket connection ──
  useEffect(() => {
    if (!userId || !user) return;
    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });
// SAHI — sirf dusre ka message add karo (apna toh sendMessage mein already add ho jaata hai)
socketRef.current.on(
  "messageReceived",
  ({ senderId, firstName, lastName, text, fileUrl, fileType }) => {
    if (senderId !== userId) {
      setMessages((prev) => [
        ...prev,
        { senderId, firstName, lastName, text, fileUrl, fileType, createdAt: new Date().toISOString() },
      ]);
    }
  }
);
    return () => socketRef.current?.disconnect();
  }, [userId, targetUserId, user]);

  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !user) return;
      setMessages((prev) => [
        ...prev,
        { senderId: userId, firstName: user?.firstName, lastName: user?.lastName, text, createdAt: new Date().toISOString() },
      ]);
      socketRef.current?.emit("sendMessage", {
        firstName: user?.firstName,
        lastName: user?.lastName,
        userId,
        targetUserId,
        text,
      });
    },
    [userId, user, targetUserId]
  );

  const sendFile = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${BASE_URL}/chat/upload`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        const { fileUrl, fileType } = res.data;
        const msgObj = {
          senderId: userId,
          firstName: user?.firstName,
          lastName: user?.lastName,
          text: "",
          fileUrl,
          fileType,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msgObj]);
        socketRef.current?.emit("sendMessage", {
          firstName: user?.firstName,
          lastName: user?.lastName,
          userId,
          targetUserId,
          text: "",
          fileUrl,
          fileType,
        });
      } catch (err) {
        console.error("File upload error:", err);
      }
    },
    [userId, user, targetUserId]
  );

  return { messages, userId, targetUser, messagesEndRef, sendMessage, sendFile };
};