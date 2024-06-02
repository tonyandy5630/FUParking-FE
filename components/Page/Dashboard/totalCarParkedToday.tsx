'use client';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TemplateDivDashboard from './templateDivDashboard';

export default function TotalCarParkedToday() {
    return (
        <TemplateDivDashboard text='Total Car Parked Today' data='0' image={DirectionsCarIcon} />
    );
}