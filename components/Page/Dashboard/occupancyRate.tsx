'use client';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TemplateDivDashboard from './templateDivDashboard';

export default function OccupancyRate() {
    return (
        <TemplateDivDashboard text='Occupancy Rate' data='0%' image={AccessTimeRoundedIcon} />
    );
}