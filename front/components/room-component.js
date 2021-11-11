import Link from "next/link";
import Moment from "react-moment";
import { shortenAddress } from "../utils/shorten-address";
import { isEmptyAddress } from "../utils/address"; 

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
          <Link href={`/user/${rent.owner}`}>
            <a className="underline">{shortenAddress(rent.owner)}</a>
          </Link>
        </div>
        {showTenent && isEmptyAddress(rent.tenant) && (
          <div>
            <span>Tenant: </span>
            <Link href={`/user/${rent.tenant}`}>
              <a className="underline">{shortenAddress(rent.tenant)}</a>
            </Link>
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
