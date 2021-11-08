import { useContext, useEffect, useState } from "react";
import { AuthContext } from ".."
import { useRouter } from 'next/router'
import Nav from '../../components/nav'

const User = () => {
    const value = useContext(AuthContext);
    const router = useRouter()
    const { address } = router?.query

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">{address}</h1>
                <div>
                    <div>Score: </div>
                    <div>Contact: 647-123-5678</div>
                </div>
            </section>
        </>
    )
}

export default User