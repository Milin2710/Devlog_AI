"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthLoader() {
  const { data: session } = useSession();
  const { setUser } = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (!session?.user) return;

    const loginUser = async () => {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/google",
        {
          email: session.user.email,
          name: session.user.name,
        },
        { withCredentials: true },
      );

      setUser(result.data);
      // setTimeout(() => {
      //   navigate.push("/");
      // }, 500);
    };

    loginUser();
  }, [session]);

  return null;
}
