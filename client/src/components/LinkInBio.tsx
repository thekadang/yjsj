import React from 'react';

interface LinkInBioProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc?: string;
    onClick?: () => void;
}

const LinkInBio: React.FC<LinkInBioProps> = ({ title, subtitle, description, imageSrc, onClick }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            onClick={onClick}
        >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200">
                {imageSrc ? (
                    <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
            <h3 className="text-md font-medium text-gray-600 mb-3">{subtitle}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
};

export default LinkInBio;
