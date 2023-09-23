import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMembers } from "./github-members.api";
import { GithubMember } from "./github-members.model";

export interface GithubMembersState {
  members: GithubMember[];
}

const initialState: GithubMembersState = {
  members: [],
};

const SLICE_NAME = "githubMembers";

export const githubMembersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchMembersAsync.fulfilled, (state, action) => {
      state.members = action.payload;
    });
  },
});

export const {} = githubMembersSlice.actions;

export const fetchMembersAsync = createAsyncThunk(
  `${SLICE_NAME}/fetchMembers`,
  async () => {
    const members = await fetchMembers();
    return members;
  }
);

export const selectMembers = (state: { githubMembers: GithubMembersState }) =>
  state.githubMembers.members;

export default githubMembersSlice.reducer;
