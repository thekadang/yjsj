import React from 'react';


interface OriginalHeaderProps {
    onLoginClick?: () => void;
    onSignUpClick?: () => void;
}

const OriginalHeader: React.FC<OriginalHeaderProps> = ({ onLoginClick, onSignUpClick }) => {
    return (
        <header data-elementor-type="header" data-elementor-id="22" className="elementor elementor-22 elementor-location-header" data-elementor-post-type="elementor_library">
            <div className="elementor-element elementor-element-2e9036c e-flex e-con-boxed e-con e-parent" data-id="2e9036c" data-element_type="container">
                <div className="e-con-inner">
                    <div className="elementor-element elementor-element-07a115a e-con-full e-flex e-con e-child" data-id="07a115a" data-element_type="container">
                        <div className="elementor-element elementor-element-680c62d elementor-widget elementor-widget-heading" data-id="680c62d" data-element_type="widget" data-widget_type="heading.default">
                            <h2 className="elementor-heading-title elementor-size-default">로고 이미지 자리</h2>
                        </div>
                        <div className="elementor-element elementor-element-403f7bd elementor-widget elementor-widget-text-editor" data-id="403f7bd" data-element_type="widget" data-widget_type="text-editor.default">
                            <p>
                                <span
                                    onClick={onLoginClick}
                                    style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                                >
                                    로그인
                                </span>
                                {' '}|{' '}
                                <span
                                    onClick={onSignUpClick}
                                    style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
                                >
                                    회원가입
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default OriginalHeader;
