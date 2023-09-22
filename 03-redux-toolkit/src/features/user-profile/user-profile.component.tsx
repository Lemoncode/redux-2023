import { useSelector } from "react-redux";
import { selectName, setName } from "./user-profile.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app-store/store";

export const UserProfileComponent = () => {
  const name = useSelector(selectName);
  const dispatch = useDispatch<AppDispatch>();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(event.target.value));
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Nombre: {name}</p>
      <input type="text" value={name} onChange={handleNameChange} />
    </div>
  );
};
