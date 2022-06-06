/* eslint-disable no-unused-vars */
import create from "zustand";
import { User } from "../types";

interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
	user: null,
	setUser: (user) =>
		set(() => ({
			user
		}))
}));

export default useUserStore;