import "./App.css";
import "antd/dist/antd.min.css";
import { BookingsProvider } from "./pages/Bookings/context/BookingsContext";
import { Bookings } from "./pages/Bookings/Bookings";

function App() {
  return (
    <div className="App">
      <BookingsProvider>
        <Bookings />
      </BookingsProvider>
    </div>
  );
}

export default App;
