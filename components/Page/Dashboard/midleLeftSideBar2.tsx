"use client";

export default function MidleLeftSideBar2() {
  return (
    <div className="flex-col min-w-80 min-h-64 bg-white rounded-md border shadow-lg flex p-5 items-start justify-around">
          <div className="flex flex-col items-start justify-center gap-4">
            <p>Total cards</p>
            <p className='font-extrabold'>1000</p>
          </div>
          <div className="w-full h-px" style={{backgroundColor: '#D9D9D9'}}></div>
          <div className="flex flex-col items-start justify-center gap-4">
            <p>Cards used</p>
            <p className='font-extrabold'>1000</p>
          </div>
        </div>
  );
}