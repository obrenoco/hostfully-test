import "./App.css";
import "antd/dist/antd.min.css";
import { BookingsProvider } from "./pages/Bookings/context/BookingsContext";
import { Bookings } from "./pages/Bookings/Bookings";
import { Header } from "./components/Header";

export const primaryColor = "#2D2AA5";

function App() {
  return (
    <div className="App">
      <BookingsProvider>
        <Header />
        <Bookings />
      </BookingsProvider>
    </div>
  );
}

export default App;
