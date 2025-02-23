// import Image from "next/image";
import SocketProvider from "@/contexts/SocketProvider";
import ConorByrneLights from "@/components/ConorByrneLights";


export default function Home() {
  
  return (
    <SocketProvider>
      <div className="w-full h-screen flex flex-col">
          <ConorByrneLights/>
      </div>
    </SocketProvider>
  );
}
