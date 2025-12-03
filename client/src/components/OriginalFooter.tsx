import React from 'react';

const OriginalFooter: React.FC = () => {
    return (
        <footer id="site-footer" className="site-footer dynamic-footer footer-has-copyright">
            <div className="footer-inner">
                <div className="site-branding show-logo">
                    <p className="site-description show">
                        My WordPress Blog
                    </p>
                </div>
                <div className="copyright show">
                    <p>모든 권리 보유</p>
                </div>
            </div>
        </footer>
    );
};

export default OriginalFooter;
