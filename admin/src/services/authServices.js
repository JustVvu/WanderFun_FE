"use server";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const url = process.env.PUBLIC_API_URL;

export const login = async (email, password) => {
  const data = {
    email: email,
    password: password,
  };

  let flag = true;

  try {
    const res = await axios.post(url + "auth/login", data);

    console.log(res);
    if (res && res.data) {
      const cookieStore = cookies();

      cookieStore.set("accessToken", res.data.access_token);
      cookieStore.set("refreshToken", res.data.refresh_token);

      return flag, res.data;
    } else {
      throw new Error("Failed to authorize user.");
    }
  } catch (error) {
    flag = false;
    console.log(error);
    return flag;
  }
};

export const refreshToken = async (refresh_token) => {
  let data = {
    grant_type: "refresh_token",
    client_id: "client",
    client_secret: "secret",
    refresh_token: refresh_tokens,
  };

  try {
    const res = await axios.post(url + "auth/refresh", data);

    if (res && res.data) {
      const cookieStore = cookies();
      const { access_token: accessToken, refresh_token: refreshToken } =
        res.data;

      cookieStore.set("accessToken", accessToken);
      cookieStore.set("refreshToken", refreshToken);
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  const cookieStore = cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect("/login");
};

export const getSession = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (accessToken) {
    const user = jwtDecode(accessToken);
    return user;
  } else {
    return undefined;
  }
};

export const getAccessToken = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (accessToken) {
    return accessToken;
  } else {
    return undefined;
  }
};

export const getRefreshToken = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (refreshToken) {
    return refreshToken;
  } else {
    return undefined;
  }
};
