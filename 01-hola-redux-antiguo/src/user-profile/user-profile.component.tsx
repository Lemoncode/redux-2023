import React from "react";

export interface UserProfileProps {
  name: string;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ name }) => {
  return (
    <>
      <h2>User Profile</h2>
      <div>
        <label>Nombre:</label>
        <span>{name}</span>
      </div>
    </>
  );
};
