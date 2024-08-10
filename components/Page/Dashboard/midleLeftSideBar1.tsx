"use client";

export default function MidleLeftSideBar1() {
  return (
    <div className="flex-col min-w-80 min-h-64 bg-white rounded-md border shadow-lg flex p-5 items-start justify-around">
          <div className="flex flex-col items-start justify-center gap-4">
            <p>Number of vehicles check-in today</p>
            <p className='font-extrabold'>1000</p>
          </div>
          <div className="w-full h-px" style={{backgroundColor: '#D9D9D9'}}></div>
          <div className="flex flex-col items-start justify-center gap-4">
            <p>Number of vehicles check-out today</p>
            <p className='font-extrabold'>1000</p>
          </div>
        </div>
  );
}