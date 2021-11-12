import Link from "next/link";
import Moment from "react-moment";
import { isEmptyAddress } from "../utils/address"; 
import { UserpageLink } from "./userpage-link";

const RoomComponent = ({ rent, children, showTenent = true }) => {
  if (!rent) {
    return;
  }

  return (
    <div className="bg-gray-purple p-5 rounded flex flex-col border-solid border-4 border-opacity-50">
      <div className="text-left mb-3">
        <span className="font-extrabold text-5xl">{rent.price}</span> ETH / month
      </div>
      <div>
        <div>
          <span className="font-bold">Address: </span>
          {rent.location}
        </div>
        <div>
          <span className="font-bold">Start date: </span>
          <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
        </div>
        <div>
          <span className="font-bold">End date: </span>
          <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
        </div>
        <div>
          <span className="font-bold">Owner: </span>
          <UserpageLink address={rent.owner} underline={true} shorten={true} />
        </div>
        {showTenent && isEmptyAddress(rent.tenant) && (
          <div>
            <span>Tenant: </span>
            <UserpageLink address={rent.tenant} underline={true} shorten={true} />
          </div>
        )}
        <Link href={`/room/${rent.contractId}`}>
          <a className="underline mt-3">Detail</a>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default RoomComponent;
