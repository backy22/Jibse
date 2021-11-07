import Link from 'next/link'
import Button from './button'
import { shortenAddress } from '../utils/shorten-address';

const Nav = ({ currentAccount, connectWalletAction, connectingWallet }) => {
  return (
    <nav className="flex justify-between p-6">
      <Link href={'/'}>Jibse</Link>
      {currentAccount ?
        <div className="flex">
          <div className="mr-6">
            <Link href={'/tenant'}>Tenant Dashboard</Link>
          </div>
          <div className="mr-6">
            <Link href={'/owner'}>Owner Dashboard</Link>
          </div>
          <div>{shortenAddress(currentAccount)}</div>
        </div>
      : (
        <div>
          <Button onClick={connectWalletAction} buttonText="Connect" isLoading={connectingWallet} />
        </div>
      )}
    </nav>
  )
}

export default Nav