import Tooltip from './Tooltip';
import { IoIosArrowForward } from 'react-icons/io';

const ButtonAction = (props) => {
  return (
    <>
      <Tooltip text="open" position="top" disabled={props?.disabled}>
        <button
          className="p-2 font-bold text-white transition-all duration-150 bg-black rounded-lg hover:bg-gray-900 group disabled:bg-opacity-40"
          onClick={() => {
            props?.setGetData(props);
            props?.setOpenModal(true);
          }}
          disabled={props?.disabled}
        >
          <IoIosArrowForward
            className={
              !props?.disabled
                ? 'transition-all duration-300 group-hover:transform group-hover:rotate-90'
                : ''
            }
          />
        </button>
      </Tooltip>
    </>
  );
};

export default ButtonAction;
