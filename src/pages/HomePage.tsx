import {Link} from "react-router-dom";

const HomePage = () => {

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl text-center font-bold text-primary pb-8">SKAITRIXA - galvas rēķinu treniņu platforma</h1>

            <p className="my-3 text-justify">
                <b>SKAITRIXA</b> - interaktīva galvas rēķinu treniņu platforma, kas ir izveidota priekš sākumskolas
                skolēniem. Tā palīdz attīstīt rēķināšanas ātrumu un pārliecību, izmantojot īsus un saprotamus
                uzdevumus.
            </p>
            <p className="my-3 text-justify">
                Skolēns var spēlēt treniņa režīmā vai pildīt skolotāja izveidoto testu. Uzdevumi ģenerējas automātiski
                un iekļauj sevī visas pamata darbības - saskaitīšanu, atņemšanu, reizināšanu un dalīšanu. Var uzstādīt
                grūtības līmeni un izvēlēties cik ilgs būs treniņš, lai trenētos sev piemērotā tempā vai pakāpeniski
                palielināt uzdevumu grūtību.
            </p>
            <p className="my-3 text-justify">
                Pēc treniņa vai testa izpildes parādās skolēna rezultāti - punktu skaits, precizitāte un vidējais
                rēķināšanas laiks. Tas palīdz sekot līdzi progresam un redzēt, kā uzlabojas galvas rēķinu prasmes.
            </p>

            <div className="flex items-center justify-center gap-2 mx-auto mt-6">
                <Link to="/login" className="text-white bg-primary p-3 rounded">Autorizēties</Link>
                <Link to="/register" className="text-primary border p-3 rounded">Izveidot kontu</Link>
            </div>
        </div>
    )
}

export default HomePage;