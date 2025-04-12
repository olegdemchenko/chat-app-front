import { createContext } from "react";
import { Profile } from "../types";

const ProfileContext = createContext<Profile | null>(null);
export default ProfileContext;
