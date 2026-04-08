const Navbar = () => {
    return (
        <div className="w-full bg-gray-200 p-5 flex items-center">
            <p className="text-left flex-1 text-xl font-semibold">Liepājas Liedaga vidusskola, 6.a klase</p>
            <div className="flex mx-3">
                <div className="w-3 h-3 rounded-full bg-green-500 my-auto mr-1"/>
                <p>Online</p>
            </div>
            <p className="text-right">Jānis Bērziņš</p>
        </div>
    )
}

export default Navbar;