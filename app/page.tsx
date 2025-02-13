// import Image from "next/image";
import SocketProvider from "@/contexts/SocketProvider";
import ConorByrneLights from "@/components/ConorByrneLights";


export default function Home() {
  return (
    <SocketProvider>
      <div className="w-full h-screen flex flex-col">
        <div className='w-full h-4 bg-green-600 text-center pb-6 items-center z-50'>
          {'Conor Byrne'}
        </div>
        <div className='w-full h-full absolute'>
          <ConorByrneLights/>
        </div>
      </div>
    </SocketProvider>
  );
}
