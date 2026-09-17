import GoodsReceiptStoreFrmOne from './GoodsReceiptStoreFrmOne'
export default GoodsReceiptStoreFrmOne


// import { useState } from "react";

// export default function MultiFormPage() {
//   const [activeForm, setActiveForm] = useState(null);

//   return (
//     <div className="flex flex-col items-center p-4">
//       <div className="flex gap-4 mb-4">
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={() => setActiveForm(1)}
//         >
//           Open Form 1
//         </button>
//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded"
//           onClick={() => setActiveForm(2)}
//         >
//           Open Form 2
//         </button>
//         <button
//           className="px-4 py-2 bg-red-500 text-white rounded"
//           onClick={() => setActiveForm(3)}
//         >
//           Open Form 3
//         </button>
//       </div>

//       {activeForm === 1 && (
//         <form className="p-4 border rounded w-80">
//           <h2 className="text-lg mb-2">Form 1</h2>
//           <input
//             type="text"
//             placeholder="Enter something"
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button className="w-full bg-blue-500 text-white py-2 rounded">
//             Submit
//           </button>
//         </form>
//       )}

//       {activeForm === 2 && (
//         <form className="p-4 border rounded w-80">
//           <h2 className="text-lg mb-2">Form 2</h2>
//           <input
//             type="email"
//             placeholder="Enter email"
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button className="w-full bg-green-500 text-white py-2 rounded">
//             Submit
//           </button>
//         </form>
//       )}

//       {activeForm === 3 && (
//         <form className="p-4 border rounded w-80">
//           <h2 className="text-lg mb-2">Form 3</h2>
//           <input
//             type="password"
//             placeholder="Enter password"
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button className="w-full bg-red-500 text-white py-2 rounded">
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }