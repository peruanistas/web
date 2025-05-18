import { Download, File } from "lucide-react";

export default function ProjectFileCard() {
    return(
        <div className="flex flex-row items-center m-1 p-10 bg-gray-200 w-full py-5 my-[5px]">
            <div className="flex w-full gap-1 flex-col">
            <h1 className="font-semibold">Solicitud formal</h1>
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit ametle ipsum mauris.</p>
            <div className="my-[10px] flex flex-row gap-1">
                <File size={20} />
                <p className="text-gray-500 text-ms">pdf 100 kb</p>
                <Download size={20} className="ml-2" />
                <p className="text-gray-500 text-ms">Descargar</p>
            </div>
            </div>
            <div className="flex justify-end ">
            <Download />
            </div>
        </div>
    );
}