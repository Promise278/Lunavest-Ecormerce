// import React from "react";
// import ProductCard from "./ProductCard";

// function Cart() {
//   return (
//     <>
//     <div className="mt-12 mb-12 md:px-38 px-6">
//       <div className="flex justify-between md:flex-row flex-col">
//         <h1 className="text-3xl font-bold">Todays For You!</h1>
//         <div className="flex gap-4 md:flex-row flex-col">
//           <button className="bg-gray-800 rounded-md h-12 w-32 text-white">
//             Best Seller
//           </button>
//           <button className="bg-gray-100 border border-black rounded-md h-12 w-32 text-black">
//             Keep Stylish
//           </button>
//           <button className="bg-gray-100 border border-black rounded-md h-12 w-36 text-black">
//             Special Discount
//           </button>
//           <button className="bg-gray-100 border border-black rounded-md h-12 w-32 text-black">
//             Offical Store
//           </button>
//           <button className="bg-gray-100 border border-black rounded-md h-12 w-38 text-black">
//             Coveted Product
//           </button>
//         </div>
//       </div>
//     </div>
//     <div>
//       <ProductCard />
//     </div>
//     </>
//   );
// }

// export default Cart;
import React from "react";
import ProductCard from "./ProductCard";

function Cart() {
  return (
    <>
      {/* Top Section */}
      <div className="mt-16 mb-12 px-6 md:px-38">
        {/* Title + Category Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Today’s <span className="text-indigo-600">For You!</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base md:text-lg">
              Discover trending collections tailored just for your style.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "Best Seller",
              "Keep Stylish",
              "Special Discount",
              "Official Store",
              "Coveted Product",
            ].map((label, index) => (
              <button
                key={index}
                className={`px-5 py-3 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                  index === 0
                    ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="px-6 md:px-20">
        <ProductCard />
      </div>
    </>
  );
}

export default Cart;