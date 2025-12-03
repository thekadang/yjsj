import React from 'react';
import { Link } from 'react-router-dom';

const MySpaceHeader: React.FC = () => {
    return (
        <header id="site-header" className="site-header dynamic-header">
            <div className="header-inner">
                <div className="site-branding show-title">
                    <div className="site-title show">
                        <Link to="/" title="홈" rel="home">
                            My Blog
                        </Link>
                    </div>
                    <p className="site-description show">
                        My WordPress Blog
                    </p>
                </div>
            </div>
        </header>
    );
};

export default MySpaceHeader;
