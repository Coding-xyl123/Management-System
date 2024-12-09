// app/ClientLayout.tsx
"use client";

import React, { FC, useEffect } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const ClientLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    socketId.on("connection", () => {});
  }, []);

  return (
    <div suppressHydrationWarning>
      {isLoading ? <Loader /> : <div>{children}</div>}
    </div>
  );
};

export default ClientLayout;
