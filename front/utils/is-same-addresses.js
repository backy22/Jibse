export const isSameAddresses = (address1, address2) => {
    if (address1.toLowerCase() === address2.toLowerCase()) {
        return true
    }
    return false
}