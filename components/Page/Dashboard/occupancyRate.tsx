'use client';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import TwoWheelerRoundedIcon from '@mui/icons-material/TwoWheelerRounded';

export default function OccupancyRate() {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-2'>
                <p>Average session duration per day</p>
                <p className='font-extrabold'>2 hours</p>
            </div>
            <div className='h-16 w-px' style={{backgroundColor: '#D9D9D9'}}></div> 
            <div className='flex flex-col gap-2'>
                <p>Total customers</p>
                <div className='flex items-center justify-between gap-5'>
                    <div className='flex'>
                        <SupervisorAccountIcon />
                        <p className='ml-1 font-extrabold'>1000</p>
                    </div>
                    <div className='flex items-center justify-around'>
                        <KeyboardDoubleArrowUpRoundedIcon style={{color:"#00A676"}}/>
                        <div className='flex'> 
                            <p className='font-extrabold'>1000</p>
                            <p className='pl-1'>in month</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-16 w-px' style={{backgroundColor: '#D9D9D9'}}></div>
            <div className='flex flex-col gap-2'>
                <p>Total vehicles</p>
                <div className='flex items-center justify-between gap-5'>
                    <div className='flex'>
                        <TwoWheelerRoundedIcon />
                        <p className='ml-1 font-extrabold'>1000</p>
                    </div>
                    <div className='flex'>
                        <KeyboardDoubleArrowUpRoundedIcon style={{color:"#00A676"}}/>
                        <div className='flex'> 
                            <p className='font-extrabold'>1000</p>
                            <p className='pl-1'>in month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}