import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {Link} from "react-router-dom";
import type {UserWithSchoolAndClass} from "../types/app.ts";

interface NavbarProps {
    user: UserWithSchoolAndClass | null;
    isOnline: boolean;
}

const Navbar = ({user, isOnline}: NavbarProps) => {
    const {signOutHook} = useAuth();

    const color = isOnline ? "bg-success" : "bg-gray-400"

    return (
        <div className="flex py-3 md:py-6 text-lg px-6 bg-primary text-white items-center justify-between">
            <Link to="/" className="text-3xl font-bold">SKAITRIXA</Link>

            {user ?
                <div className="flex">
                    <div className="hidden md:flex items-center gap-3">
                        { user.role === "student" && user.schools && user.classes &&
                            <p className="flex-1">{user.schools.name + ", "}{user.classes.number + "." + user.classes.letter + " klase"}</p>
                        }
                        <div className="flex items-center gap-1">
                            <div className={`rounded-full ${color} w-3 h-3`}/>
                            <p>{isOnline ? "Tiešsaistē" : "Bezsaistē"}</p>
                        </div>
                        <p>{user.name} {user.surname}</p>
                    </div>
                    <div className="flex items-center gap-2 mx-3">
                        <img
                            src="/user_icon.png"
                            alt="Account"
                            className="w-10"
                        />
                        <button onClick={signOutHook}>Iziet</button>
                    </div>
                </div>
                :
                <div>
                    <Link to="/login" className="text-lg font-semibold">Autentificēties</Link>
                </div>
            }

        </div>
    )
}

export default Navbar;