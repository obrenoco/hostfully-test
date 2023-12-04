import "./App.css";
import "antd/dist/antd.min.css";
import { BookingsProvider } from "./pages/Bookings/context";
import { Bookings } from "./pages/Bookings/Index";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="App bg-background">
      <BookingsProvider>
        <Header />
        <Bookings />
      </BookingsProvider>
    </div>
  );
}

export default App;
