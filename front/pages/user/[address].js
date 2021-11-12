import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { AuthContext } from "../../components/auth-wrapper";

const User = () => {
    const value = useContext(AuthContext);
    const router = useRouter()
    const { address } = router?.query

    const [score, setScore] = useState(0);

    useEffect(() => {
        const getUserScore = async() => {
            try {
                const scoreTxn = await value.scoreContract.getScore(address, { gasLimit: 1000000 })
                setScore(scoreTxn.toNumber())
            } catch (error) {
                console.log('Get user score Error: ', error)
            }
        }

        getUserScore();
    }, [address, value.scoreContract])

    return (
        <div>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center my-12">{address}</h1>
                <div>
                    <div>Score: {score}</div>
                    <div>Contact: 647-123-5678</div>
                </div>
            </section>
        </div>
    )
}

export default User