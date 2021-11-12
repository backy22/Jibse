import Link from 'next/link'
import Button from './button'
import { useRouter } from 'next/router'
import { ADMIN_ADDRESS } from '../utils/constants';
import { isSameAddresses } from '../utils/is-same-addresses';
import { UserpageLink } from './userpage-link';

const Nav = ({ account, connectWalletAction, connectingWallet }) => {
  const router = useRouter()

  return (
    <nav className="flex justify-between p-6">
      <Link href={'/'}>Jibse</Link>
      {account ?
        <div className="flex">
          {isSameAddresses(account, ADMIN_ADDRESS) && (
            <div className={`mr-6 ${router.pathname == '/admin' ? 'border-b-2' : ''}`}>
              <Link href={'/admin'}>Admin</Link>
            </div>
          )}
          <div className={`mr-6 ${router.pathname == '/tenant' ? 'border-b-2' : ''}`}>
            <Link href={'/tenant'}>Tenant Dashboard</Link>
          </div>
          <div className={`mr-6 ${router.pathname == '/owner' ? 'border-b-2' : ''}`}>
            <Link href={'/owner'}>Owner Dashboard</Link>
          </div>
          <div>
            <UserpageLink address={account} shorten={true} />
          </div>
        </div>
      : (
        <div className="w-41">
          <Button onClick={connectWalletAction} buttonText="Connect" isLoading={connectingWallet} />
        </div>
      )}
    </nav>
  )
}

export default Nav