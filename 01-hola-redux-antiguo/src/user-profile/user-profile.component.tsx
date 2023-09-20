import React from "react";

export interface UserProfileProps {
  name: string;
  onUpdateUserName: (name: string) => void;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ name, onUpdateUserName }) => {
  return (
    <>
      <h2>User Profile</h2>
      <div>
        <label>Nombre:</label>
        <span>{name}</span>
        <input value={name} onChange={e => onUpdateUserName(e.target.value)}></input>
      </div>
    </>
  );
};
