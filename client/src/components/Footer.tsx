import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-100 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-600">
                <div className="mb-2">
                    <p className="font-semibold">My WordPress Blog</p>
                </div>
                <div className="copyright text-sm">
                    <p>&copy; {new Date().getFullYear()} 모든 권리 보유</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
