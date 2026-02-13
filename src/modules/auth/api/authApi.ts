import { api } from "@/core/api/client"

export const loginRequest = (data:{email:string,password:string}) =>
  api.post("/auth/login", data)

export const registerRequest = (data:{name:string,email:string,password:string}) =>
  api.post("/auth/register", data)

export const getMeRequest = () =>
  api.get("/auth/me")





