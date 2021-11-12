import Link from 'next/link'
import { shortenAddress } from '../utils/shorten-address'

export const UserpageLink = ({ address, shorten = false, underline = false }) => {
    return (
        <Link href={`/user/${address}`}>
            <a className={`${underline ? 'underline' : ''}`}>{shorten ? shortenAddress(address) : address}</a>
        </Link>
    )
}