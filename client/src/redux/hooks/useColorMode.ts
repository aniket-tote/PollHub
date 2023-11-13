import { useDispatch, useSelector } from "react-redux";
import { toggleColorMode } from "../slices/colorMode";
import { RootState } from "../store";

const useColorMode = () => {
  const colorMode = useSelector(
    (state: RootState) => state.colorModeReducer.colorMode
  );
  const dispatch = useDispatch();

  const toggleColorModeFn = () => {
    dispatch(toggleColorMode());
  };

  return {
    colorMode,
    toggleColorMode: toggleColorModeFn,
  };
};

export default useColorMode;
