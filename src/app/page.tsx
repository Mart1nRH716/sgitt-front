import Buscador from "@/components/Buscador";
import Footer from "@/components/Footer";
import NabVar from "@/components/NabVar";
import PropuestaDiv from "@/components/PropuestaDiv";
import ValorDiv from "@/components/ValorDiv";
import Landing from "@/components/Landing";

const App = () =>{
  return (
    <main className="w-[90%] m-auto">
      <Landing /> 
      <Footer />
      {/* 
      <NabVar />
      <Buscador />
      <PropuestaDiv />
      <ValorDiv />
      <Footer />
      */}
    </main>
  );
}

export default App;
