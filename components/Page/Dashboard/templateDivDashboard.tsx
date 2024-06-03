import { SvgIconComponent } from '@mui/icons-material';

interface data {
    text: string;
    data: any;
    image?: SvgIconComponent;
    textImage?: string
}

export default function TemplateDivDashboard({ text, data, image: Icon, textImage }: data) {
    return (
        <div className='flex flex-col max-w-56 bg-white min-w-52 min-h-32 max-h-40 items-center justify-evenly rounded-md border shadow-lg'>
            <div className='flex flex-col items-center justify-center'>
                <p className='text-wrap'>{text}</p>
                {Icon && <Icon />}
                {textImage && <p>{textImage}</p>}
            </div>
            <p>{data}</p>
        </div>
    )
}