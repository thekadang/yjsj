import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="w-full bg-white shadow-sm py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="logo">
                    <h2 className="text-xl font-bold text-gray-800">로고 이미지 자리</h2>
                </div>
                <nav>
                    <ul className="flex space-x-4 text-gray-600">
                        <li>
                            <Link to="/login" className="hover:text-gray-900">로그인</Link>
                        </li>
                        <li>|</li>
                        <li>
                            <Link to="/signup" className="hover:text-gray-900">회원가입</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
