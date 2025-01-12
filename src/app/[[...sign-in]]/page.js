"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  useEffect(() => {
    const role = user?.publicMetadata.role
    if (role) {
      router.push(`/${role}`)
    }
  }, [user, router])
  
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#edf9fd",
      }}
      className="h-screen flex items-center justify-center bg-neuelight"
    >
      <SignIn.Root>
        <SignIn.Step
          name="start"
          style={{
            backgroundColor: "#fff",
            padding: "48px",
            borderRadius: "6px",
            shadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            shadowColored: "0 25px 50px -12px var(--tw-shadow-color)",
            boxShadow:
              "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            className="text-xl font-bold flex items-center gap-2"
          >
            <Image src="/logo.png" alt="logo" width={24} height={24} />
            Schoolizer
          </h1>
          <h2 style={{ color: "#9ca3af" }}>Sign in to your account</h2>
          <Clerk.GlobalError
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              color: "#f87171",
            }}
            className="text-sm text-red-400"
          />
          <Clerk.Field
            name="identifier"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            className="flex flex-col gap-2"
          >
            <Clerk.Label
              style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "#6b7280",
              }}
              className="text-xs text-gray-500"
            >
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              style={{
                padding: "8px",
                borderRadius: "6px",
                ringOffsetShadow:
                  "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
                ringShadow:
                  "var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
                boxShadow:
                  "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)",
                ringColor: "#d1d5db",
              }}
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError
              style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "#f87171",
              }}
              className="text-xs text-red-400"
            />
          </Clerk.Field>
          <Clerk.Field
            name="password"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            className="flex flex-col gap-2"
          >
            <Clerk.Label
              style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "#6b7280",
              }}
              className="text-xs text-gray-500"
            >
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              style={{
                padding: "8px",
                borderRadius: "6px",
                ringOffsetShadow:
                  "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
                ringShadow:
                  "var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
                boxShadow:
                  "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)",
                ringColor: "#d1d5db",
              }}
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError
              style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "#f87171",
              }}
              className="text-xs text-red-400"
            />
          </Clerk.Field>
          <SignIn.Action
            submit
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
              borderRadius: "6px",
              fontSize: "0.875rem",
              padding: "10px",
            }}
            className="bg-blue-600 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}

export default LoginPage