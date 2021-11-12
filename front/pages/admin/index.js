import { useContext, useEffect, useState } from "react";
import Button from '../../components/button';
import { AuthContext } from "../../components/auth-wrapper";

const Admin = () => {
    const value = useContext(AuthContext);
    const [allTenants, setAllTenants] = useState([])
    const [allOwners, setAllOwners] = useState([])

    useEffect(() => {
        const getAllTenants = async() => {
            try {
                const allTenantsTxn = await value.rentContract.getAllTenantsAddress()
                setAllTenants(allTenantsTxn)
            } catch (error) {
              console.log('get all tenants Error: ', error)
            }
        }

        const getAllOwners = async() => {
            try {
                const allOwnersTxn = await value.rentContract.getAllOwnersAddress()
                setAllOwners(allOwnersTxn)
            } catch (error) {
              console.log('get all owners Error: ', error)
            }
        }

        if (value.rentContract) {
            getAllTenants();
            getAllOwners();
        }
    }, [value.rentContract])

    async function calculateTenantScore(address) {
        try {
            const calculateTxn = await value.scoreContract.calculateTenantScore(address, { gasLimit: 1000000 })
            console.log('calculateTxn', calculateTxn)
        } catch (error) {
            console.log('Calculate Tenant Score Error: ', error)
        }
    }

    async function calculateOwnerScore(address) {
        try {
            const calculateTxn = await value.scoreContract.calculateOwnerScore(address, { gasLimit: 1000000 })
            console.log('calculateTxn', calculateTxn)
        } catch (error) {
            console.log('Calculate Owner Score Error: ', error)
        }
    }

    return (
        <div>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Admin</h1>
                {allTenants.length > 0 && allTenants.map((address) => (
                    <div className="flex bg-gray-purple p-2 m-2 rounded justify-between items-center" key={address}>
                        <div>{address}</div>
                        <div className="w-64">
                            <Button onClick={() => calculateTenantScore(address)} buttonText="Calculate Tenant Score"/>
                        </div>
                    </div>
                ))}

                {allOwners.length > 0 && allOwners.map((address) => (
                    <div className="flex bg-gray-purple p-2 m-2 rounded justify-between items-center" key={address}>
                        <div>{address}</div>
                        <div className="w-64">
                            <Button onClick={() => calculateOwnerScore(address)} buttonText="Calculate Owner Score"/>
                        </div>
                    </div>
                ))}
                
            </section>
        </div>
    )
}

export default Admin