import {Link} from "react-router-dom";
import type {User} from "../shared/types/database.ts";
import PageCard from "../shared/components/PageCard.tsx";

interface HomepageProps {
    user: User | null;
}

const HomePage = ({user}: HomepageProps) => {

    return (
        <PageCard title="SKAITRIXA - galvas treniņu platforma">

            <p className="my-7 text-justify text-lg md:text-2xl">
                <span className="font-bold text-primary">SKAITRIXA</span> - interaktīva galvas rēķinu treniņu platforma sākumskolas skolēniem. Tā palīdz attīstīt
                rēķināšanas ātrumu un pārliecību, izmantojot īsus un saprotamus uzdevumus.
            </p>
            <p className="my-7 text-justify text-lg md:text-2xl">
                Skolēns var spēlēt treniņa režīmā vai pildīt skolotāja izveidotos testus. Uzdevumi ģenerējas automātiski
                un iekļauj sevī visas pamata darbības - saskaitīšanu, atņemšanu, reizināšanu un dalīšanu. Var uzstādīt
                grūtības līmeni un izvēlēties treniņa ilgumu.
            </p>
            <p className="my-7 text-justify text-lg md:text-2xl">
                Pēc treniņa vai testa izpildes parādās skolēna rezultāti - punktu skaits, precizitāte un vidējais
                rēķināšanas laiks.
            </p>

            {user ?
                <div className="mt-8 flex justify-center">
                    <Link to="/dashboard" className="text-white bg-primary p-3 rounded w-2/3 text-center text-lg md:text-2xl">Turpināt</Link>
                </div>
                :
                <div className="flex items-center justify-center gap-2 mx-auto mt-8">
                    <Link to="/login" className="text-white bg-primary p-3 rounded text-lg md:text-xl font-semibold">Autorizēties</Link>
                    <Link to="/register" className="text-primary border p-3 rounded md:text-lg">Izveidot kontu</Link>
                </div>
            }
        </PageCard>
    )
}

export default HomePage;