import { useContext, useEffect, useState } from "react";
import { AuthContext } from ".."
import Nav from '../../components/nav'
import RoomComponent from '../../components/room-component';

const TenantDashboard = () => {
    const value = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [myRentsAsTenant, setMyRentsAsTenant] = useState([])

    useEffect(() => {
        const getMyScore = async() => {
            try {
                const scoreTxn = await value.scoreContract.getScore(value.account, { gasLimit: 1000000 })
                setScore(scoreTxn.toNumber())
            } catch (error) {
                console.log('Get score Error: ', error)
            }
        }

        const filteredMyRent = value.myRents.filter((rent) => rent.tenant.toLowerCase() === value.account)
        setMyRentsAsTenant(filteredMyRent)

        getMyScore();
    }, [value.account, value.scoreContract, value.myRents, value.rentContract])

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Tenant Dashboard</h1>
                <div className="mb-8">
                    <div>Score: {score}</div>
                    <div>Contact: 647-123-5678</div>
                </div>
                {myRentsAsTenant.length > 0 && (
                    <>
                        <h4>Current Rent</h4>
                        {myRentsAsTenant.map((rent) => (
                            <RoomComponent rent={rent} />
                        ))}
                    </>
                )}
                {value.appliedRents.length > 0 && (
                    <>
                        <h4>Applied Rent</h4>
                        {value.appliedRents.map((rent) => (
                            <RoomComponent rent={rent} />
                        ))}
                    </>
                )}
            </section>
        </>
    )
}

export default TenantDashboard