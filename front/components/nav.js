const Nav = ({currentAccount, connectWalletAction}) => {

  return (
    <nav className="flex justify-between p-6">
      <div>Jibse</div>
      {currentAccount ?
        <div>{currentAccount}</div>
      : (
        <div>
          <button onClick={connectWalletAction} className="text-green-300 border-green-300 rounded-md border-solid border-2 p-2">Connect</button>
        </div>
      )}
    </nav>
  )
}

export default Nav