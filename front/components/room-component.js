import Link from 'next/link'
import Moment from 'react-moment';
import Graph from './graph';
import { shortenAddress } from '../utils/shorten-address';

const RoomComponent = ({rent}) => {
    if (!rent) {
        return
    }
    return (
        <div className="flex">
            <div className="bg-gray-purple p-4 mb-4 rounded mr-6">
                <Graph />
            </div>
            <div>
                <div>{rent.location}</div>
                <div>Rent Date:
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
                </div>
                <div>
                    <Link href={`/user/${rent.owner}`}>
                        <a>Owner Address: {shortenAddress(rent.owner)}</a>
                    </Link>
                </div>
                <div>
                    <Link href={`/user/${rent.tenant}`}>
                        <a>Tenant Address: {shortenAddress(rent.tenant)}</a>
                    </Link>
                </div>
                <div>{rent.price} eth/month</div>
                <Link href={`/room/${rent.contractId}`}>
                    <a>Room Detail</a>
                </Link>
            </div>
        </div>
    )
}

export default RoomComponent