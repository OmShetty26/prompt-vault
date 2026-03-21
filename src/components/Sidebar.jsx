function Sidebar({prompts}) {
    const prompt_list = prompts.map( (prompt, index) => (
        <div key={index} className="flex justify-start items-center min-h-12 w-full pl-4 rounded-full hover:bg-gray-400/10">
            <h2>
                { prompt }
            </h2>
        </div>
    ));

    return(
        <div className="h-screen p-2 bg-gray-800 text-white flex flex-col gap-2 duration-200 border-r-4 border-r-gray-900">
            { prompt_list }
        </div>
    );
}
export default Sidebar;