import { useContext, useState } from "react";
import { AuthContext } from ".."
import Nav from '../../components/nav'
import Button from '../../components/button'

const Admin = () => {
    const value = useContext(AuthContext);

    async function calculateTenantScore(address) {
        console.log('onclick', address)
        try {
            const calculateTxn = await value.scoreContract.calculateTenantScore(address, { gasLimit: 1000000 })
            console.log('calculateTxn', calculateTxn)
        } catch (error) {
            console.log('Get reviews Error: ', error)
        }
    }

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Admin</h1>
                <Button onClick={() => calculateTenantScore('0xECcC87321FD9C54c51aB3FFfAfc19c5779cE9250')} buttonText="Calculate Tenant Score"/>
            </section>
        </>
    )
}

export default Admin