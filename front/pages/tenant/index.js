import { useContext, useEffect, useState } from "react";
import { AuthContext } from ".."
import Nav from '../../components/nav'

const TenantDashboard = () => {
    const value = useContext(AuthContext);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const getMyScore = async() => {
            try {
                const scoreTxn = await value.scoreContract.getScore(value.account, { gasLimit: 1000000 })
                console.log('scoreTxn', scoreTxn.toNumber())
                setScore(scoreTxn.toNumber())
            } catch (error) {
                console.log('Get score Error: ', error)
            }
        }

        getMyScore();
    }, [value.account, value.scoreContract])

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Tenant Dashboard</h1>
                <div>
                    <div>Score: {score}</div>
                    <div>Contact: 647-123-5678</div>
                </div>
            </section>
        </>
    )
}

export default TenantDashboard