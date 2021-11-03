import Link from 'next/link'
import Button from './button'

const Nav = ({ currentAccount, connectWalletAction }) => {
  return (
    <nav className="flex justify-between p-6">
      <Link href={'/'}>Jibse</Link>
      {currentAccount ?
        <>
          <Link href={'/tenant'}>Tenant Dashboard</Link>
          <Link href={'/owner'}>Owner Dashboard</Link>
          <div>{currentAccount}</div>
        </>
      : (
        <div>
          <Button onClick={connectWalletAction} buttonText="Connect" />
        </div>
      )}
    </nav>
  )
}

export default Nav