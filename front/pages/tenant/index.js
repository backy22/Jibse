import { useContext, useState } from "react";
import { AuthContext } from ".."
import Nav from '../../components/nav'

const TenantDashboard = () => {
    const value = useContext(AuthContext);

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Tenant Dashboard</h1>
            </section>
        </>
    )
}

export default TenantDashboard