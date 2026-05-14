import PageCard from "../components/PageCard.tsx";
import Button from "../components/Button.tsx";

const OfflinePage = () => {
    return (
        <PageCard title="Nav interneta savienojuma">
            <p className="text-xl text-center mb-4">
                Esi pieslēdzies lietotnei bez interneta savienojuma. Lūdzu, pieslēdzies internetam un pamēģini vēlreiz!
            </p>
            <div className="flex justify-center items-center w-full"><Button variant="primary" onClick={() => window.location.reload()}>Pamēģināt vēlreiz</Button></div>
        </PageCard>
    )
}

export default OfflinePage;