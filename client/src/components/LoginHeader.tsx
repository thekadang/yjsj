import React from 'react';


interface LoginHeaderProps {
    onMySpaceClick?: () => void;
    onLoginClick?: () => void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ onMySpaceClick, onLoginClick }) => {
    return (
        <header data-elementor-type="header" data-elementor-id="27" className="elementor elementor-27 elementor-location-header" data-elementor-post-type="elementor_library">
            <div className="elementor-element elementor-element-7feb5003 e-flex e-con-boxed e-con e-parent" data-id="7feb5003" data-element_type="container">
                <div className="e-con-inner">
                    <div className="elementor-element elementor-element-5e24ba4f e-con-full e-flex e-con e-child" data-id="5e24ba4f" data-element_type="container">
                        <div className="elementor-element elementor-element-30791cd elementor-widget elementor-widget-heading" data-id="30791cd" data-element_type="widget" data-widget_type="heading.default">
                            <h2 className="elementor-heading-title elementor-size-default">로고 이미지 자리</h2>
                        </div>
                        <div className="elementor-element elementor-element-3e9b74cd elementor-widget elementor-widget-text-editor" data-id="3e9b74cd" data-element_type="widget" data-widget_type="text-editor.default">
                            <p>
                                <span
                                    onClick={onMySpaceClick}
                                    style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                                >
                                    내 공간
                                </span>
                                {' '}|{' '}
                                <span
                                    onClick={onLoginClick}
                                    style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                                >
                                    내 정보
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LoginHeader;
