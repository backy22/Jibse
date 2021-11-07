export const shortenAddress = (address) => {
    const first4 = address.slice(0,4);
    const last4 = address.slice(address.length - 4);
    return `${first4}....${last4}`
}