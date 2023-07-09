import { IUserConnection } from "@/types/UserConnection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersState {
  users: IUserConnection[] | null;
}

const initialState: UsersState = {
  users: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUserConnection[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;
