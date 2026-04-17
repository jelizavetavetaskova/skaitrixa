import {Link} from "react-router-dom";

const HomePage = () => {

    return (
        <div>
            <h1>SKAITRIXA - galvas rēķinu treniņu platforma</h1>

            <p>
                <b>SKAITRIXA</b> - interaktīva galvas rēķinu treniņu platforma, kas ir izveidota priekš sākumskolas
                skolēniem. Tā palīdz attīstīt rēķināšanas ātrumu un pārliecību, izmantojot īsus un saprotamus
                uzdevumus.
            </p>
            <p>
                Skolēns var spēlēt treniņa režīmā vai pildīt skolotāja izveidoto testu. Uzdevumi ģenerējas automātiski
                un iekļauj sevī visas pamata darbības - saskaitīšanu, atņemšanu, reizināšanu un dalīšanu. Var uzstādīt
                grūtības līmeni un izvēlēties cik ilgs būs treniņš, lai trenētos sev piemērotā tempā vai pakāpeniski
                palielināt uzdevumu grūtību.
            </p>
            <p>
                Pēc treniņa vai testa izpildes parādās skolēna rezultāti - punktu skaits, precizitāte un vidējais
                rēķināšanas laiks. Tas palīdz sekot līdzi progresam un redzēt, kā uzlabojas galvas rēķinu prasmes.
            </p>

            <Link to="/login">Autorizēties</Link>
            <Link to="/register">Izveidot kontu</Link>
        </div>
    )
}

export default HomePage;