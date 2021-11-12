import { useContext, useEffect, useState } from "react";
import Button from '../../components/button';
import { AuthContext } from "../../components/auth-wrapper";
import { Notify } from "../../components/notify";
import { UserpageLink } from "../../components/userpage-link";

const Admin = () => {
    const value = useContext(AuthContext);
    const [allTenants, setAllTenants] = useState([])
    const [allOwners, setAllOwners] = useState([])
    const [toast, setToast] = useState(null)

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

        if (value.scoreContract) {
            const onTenantScoreCalculated = async(address) => {
                setToast({message: 'Tenant Score Calculated', type: 'success', id: address})
            }

            const onOwnerScoreCalculated = async(address) => {
                setToast({message: 'Owner Score Calculated', type: 'success', id: address})
            }

            value.scoreContract.on('TenantScoreCalculated', onTenantScoreCalculated);
            value.scoreContract.on('OwnerScoreCalculated', onOwnerScoreCalculated);

            return () => {
                value.scoreContract.off('TenantScoreCalculated', onTenantScoreCalculated);
                value.scoreContract.off('OwnerScoreCalculated', onOwnerScoreCalculated);
            }
        }
    }, [value.rentContract, value.scoreContract])

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
            {toast && <Notify message={toast.message} type={toast.type} id={toast.id} />}
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Admin</h1>
                {allTenants.length > 0 && allTenants.map((address) => (
                    <div className="flex bg-gray-purple p-2 my-2 rounded justify-between items-center" key={address}>
                        <div>
                            <UserpageLink address={address} />
                        </div>
                        <div className="w-64">
                            <Button onClick={() => calculateTenantScore(address)} buttonText="Calculate Tenant Score"/>
                        </div>
                    </div>
                ))}

                {allOwners.length > 0 && allOwners.map((address) => (
                    <div className="flex bg-gray-purple p-2 my-2 rounded justify-between items-center" key={address}>
                        <div>
                            <UserpageLink address={address} />
                        </div>
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