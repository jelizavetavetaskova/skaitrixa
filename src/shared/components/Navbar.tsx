import type {Class, School, User} from "../types/database.ts";
import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase.ts";
import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {Link} from "react-router-dom";

interface NavbarProps {
    user: User | null;
}

const Navbar = ({user}: NavbarProps) => {
    const [school, setSchool] = useState<School|null>(null);
    const [stClass, setStClass] = useState<Class|null>(null);

    const {signOut} = useAuth();

    useEffect(() => {
        const getSchool = async () => {
            if (!user?.school_id) return;

            const {data, error} = await supabase.from("schools").select("*").eq("school_id", user?.school_id).single();

            if (error) {
                console.log(error.message);
                return;
            }

            setSchool(data);
        }

        const getClass = async () => {
            if (!user?.class_id) return;

            const {data, error} = await supabase.from("classes").select("*").eq("class_id", user?.class_id).single();

            if (error) {
                console.log(error.message);
                return;
            }

            setStClass(data);
        }
        
        getSchool();
        getClass();
    }, [user?.school_id, user?.class_id]);

    return (
        <div className="flex py-3 text-lg px-3 bg-primary text-white items-center justify-between">
            <p className="text-3xl font-bold">SKAITRIXA</p>

            {user ?
                <div>
                    <div className="hidden md:block">
                        { user.role === "student" && school && stClass &&
                            <p className="flex-1">{school.name + ", "}{stClass.number + "." + stClass.letter + " klase"}</p>
                        }
                        <div>
                            <div className="rounded-full bg-success"/>
                            <p>Online</p>
                        </div>
                        <p>{user.name} {user.surname}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <img
                            src="/user_icon.png"
                            alt="Account"
                            className="w-15"
                        />
                        <button onClick={signOut}>Iziet</button>
                    </div>
                </div>
                :
                <div>
                    <Link to="/login">Autorizēties</Link>
                </div>
            }

        </div>
    )
}

export default Navbar;