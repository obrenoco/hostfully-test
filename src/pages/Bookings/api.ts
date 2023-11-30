export type GetBookings = {
  id: number;
  hostId: number;
  name: string;
  dailyPrice: number;
  totalPrice: number;
  img: string;
  startDate: string;
  adults: number;
  kids: number;
  enfants: number;
  endDate: string;
  totalNights: number;
  blockedDates: [string, string][];
};

export type PostBooking = {
  id: number;
  hostId: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  totalPrice: number;
  adults: number;
  kids?: number;
  enfants?: number;
  observations?: string;
};

export type GetHosts = Pick<
  GetBookings,
  "hostId" | "name" | "dailyPrice" | "img" | "blockedDates"
>;

export const getBookings: GetBookings[] = [
  {
    id: 1,
    hostId: 1,
    name: "Cabo Frio - 3 bedroom",
    adults: 2,
    kids: 2,
    enfants: 1,
    dailyPrice: 130,
    startDate: "12-18-2023",
    endDate: "12-23-2023",
    totalNights: 5,
    totalPrice: 650,
    img: "https://viagemeturismo.abril.com.br/wp-content/uploads/2023/05/VT-Airbnb-Cabo-Frio-1.jpeg?quality=90&strip=info&w=720&crop=1",
    blockedDates: [
      ["12-12-2023", "12-14-2023"],
      ["12-18-2023", "12-22-2023"],
    ],
  },
  {
    id: 2,
    hostId: 2,
    totalNights: 4,
    name: "Rio de Janeiro",
    adults: 3,
    kids: 0,
    enfants: 0,
    dailyPrice: 150,
    startDate: "12-25-2023",
    endDate: "12-30-2023",
    totalPrice: 600,
    blockedDates: [["12-25-2023", "12-30-2023"]],
    img: "https://a.cdn-hotels.com/gdcs/production67/d440/98ce2718-e399-48d7-867e-5a49a19d87f3.jpg",
  },
];

// export const getBookings: BookingType[] = [
//   {
//     key: 1,
//     name: "Cabo Frio - 3 bedroom",
//     startDate: "12/01/2023",
//     endDate: "12/02/2023",
//     totalNights: 2,
//     dailyPrice: 150,
//     totalPrice: 300,
//     adults: 2,
//     kids: 3,
//     enfants: 1,
//     img: "https://viagemeturismo.abril.com.br/wp-content/uploads/2023/05/VT-Airbnb-Cabo-Frio-1.jpeg?quality=90&strip=info&w=720&crop=1",
//   },
//   {
//     key: 2,
//     name: "Cape Town with amazing view",
//     startDate: "12/12/2023",
//     endDate: "12/15/2023",
//     totalNights: 3,
//     totalPrice: 450,
//     dailyPrice: 150,
//     adults: 4,
//     kids: 0,
//     enfants: 1,
//     img: "https://a.cdn-hotels.com/gdcs/production67/d440/98ce2718-e399-48d7-867e-5a49a19d87f3.jpg",
//     observations:
//       "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
//   },
// ];

export const getHosts: GetHosts[] = [
  {
    hostId: 1,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Cabo Frio - 3 bedroom",
    dailyPrice: 150,
    img: "https://viagemeturismo.abril.com.br/wp-content/uploads/2023/05/VT-Airbnb-Cabo-Frio-1.jpeg?quality=90&strip=info&w=720&crop=1",
  },
  {
    hostId: 2,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Cape Town with amazing view",
    dailyPrice: 150,
    img: "https://a.cdn-hotels.com/gdcs/production67/d440/98ce2718-e399-48d7-867e-5a49a19d87f3.jpg",
  },
  {
    hostId: 3,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Cozy Apartment",
    dailyPrice: 140,
    img: "https://www.travelandleisure.com/thmb/U-yk2LNxx3CaAlZi32QN_SgLxTg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/maryland-airbnb-SOLOAIRBNBS0321-743ce98570374f3eafc7ba51f1b49a51.jpg",
  },
  {
    hostId: 4,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Luxury Villa",
    dailyPrice: 240,
    img: "https://media-cdn.tripadvisor.com/media/vr-splice-j/09/f8/37/f3.jpg",
  },
  {
    hostId: 5,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Beach House",
    dailyPrice: 180,
    img: "https://www.prestigeholidayhomes.com.au/wp-content/uploads/2022/06/4cefa059-73f7-c92f-a0fb-23492fa7c8eb.jpg",
  },
  {
    hostId: 6,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "Mountain Cabin",
    dailyPrice: 120,
    img: "https://mountaincabinsutah.com/wp-content/uploads/2018/06/Mountain-Cabins-Utah-Log-Cabin-vacation-rental-sundance-ut.jpg",
  },
  {
    hostId: 7,
    blockedDates: [["12-04-2023", "12-08-2023"]],
    name: "City Loft",
    dailyPrice: 160,
    img: "https://media-cdn.tripadvisor.com/media/photo-s/14/b0/d3/c2/taylor-loft-sleeps-2.jpg",
  },
];
