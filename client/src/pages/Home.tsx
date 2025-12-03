import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OriginalLinkInBio from '../components/OriginalLinkInBio';
import OriginalHeader from '../components/OriginalHeader';
import OriginalFooter from '../components/OriginalFooter';
import Modal3D from '../components/Modal3D';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import SignUpInfoModal from '../components/SignUpInfoModal';

const Home: React.FC = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isSignUpInfoModalOpen, setIsSignUpInfoModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const navigate = useNavigate();

    const items = [
        {
            title: "나의 영정사진",
            subtitle: "내가 원하는 나의 마지막 모습",
            description: "최대 5장의 사진을 보관 / 가장 마음에 드는 대표사진 설정",
            imageSrc: "/images/elementor-images-placeholder.png"
        },
        {
            title: "나의 일기장",
            subtitle: "내가 남기는 나의 이야기",
            description: "문자 및 음성으로 기록 / 친구들, 특정 내사람을 지정해서 기록",
            imageSrc: "/images/elementor-images-placeholder.png"
        },
        {
            title: "내가 하고픈 말",
            subtitle: "내가 진짜 하고싶은 말",
            description: "내가 남기는 짧은 문구와 내가 남기는 유언글",
            imageSrc: "/images/elementor-images-placeholder.png"
        },
        {
            title: "나의 사전준비",
            subtitle: "남은 이들을 위한 나의 준비",
            description: "사전에 가입한 보험 / 상조 상품과 담당자정보",
            imageSrc: "/images/elementor-images-placeholder.png"
        },
        {
            title: "나의 공간",
            subtitle: "내가 떠나도 ...",
            description: "내가 떠난 후에도 내사람들이 찾아와 남길 수 있는 방명록",
            imageSrc: "/images/elementor-images-placeholder.png"
        }
    ];

    const itemClasses = [
        "elementor-element-47eb37e",
        "elementor-element-e61942c",
        "elementor-element-95984ea",
        "elementor-element-648f876",
        "elementor-element-5c7efd7"
    ];

    const handleLoginSuccess = (user: any) => {
        setIsLoginModalOpen(false);
        setCurrentUser(user);

        // Check if user needs to complete signup info
        // We check for a required field like 'birthdate'
        if (user && !user.birthdate) {
            setTimeout(() => setIsSignUpInfoModalOpen(true), 100);
        } else {
            navigate('/login');
        }
    };

    const openSignUp = () => {
        setIsLoginModalOpen(false);
        setTimeout(() => setIsSignUpModalOpen(true), 300);
    };

    const openLogin = () => {
        setIsSignUpModalOpen(false);
        setTimeout(() => setIsLoginModalOpen(true), 300);
    };

    return (
        <>
            <div style={{ filter: (isLoginModalOpen || isSignUpModalOpen || isSignUpInfoModalOpen) ? 'blur(5px)' : 'none', transition: 'filter 0.3s ease' }}>
                <OriginalHeader
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    onSignUpClick={() => setIsSignUpModalOpen(true)}
                />
                <div className="elementor elementor-16">
                    {/* Video Section */}
                    <div
                        className="elementor-element elementor-element-5b808a9 e-flex e-con-boxed e-con e-parent"
                        data-id="5b808a9"
                        data-element_type="container"
                        style={{ position: 'relative', overflow: 'hidden', minHeight: '50vh' }}
                    >
                        <div className="e-con-inner">
                            <div className="elementor-background-video-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                                <div className="elementor-background-video-embed" style={{ width: '100%', height: '100%' }}>
                                    <iframe
                                        className="elementor-background-video-embed__frame"
                                        src="https://www.youtube.com/embed/o0tvAUjeklU?controls=0&rel=0&playsinline=1&enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=o0tvAUjeklU"
                                        title="Background Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Heading & Text Section */}
                    <div className="elementor-element elementor-element-7a3e127 e-flex e-con-boxed e-con e-parent" data-id="7a3e127" data-element_type="container">
                        <div className="e-con-inner">
                            <div className="elementor-element elementor-element-b906f0c elementor-widget elementor-widget-heading" data-id="b906f0c" data-element_type="widget" data-widget_type="heading.default">
                                <div className="elementor-widget-container">
                                    <h2 className="elementor-heading-title elementor-size-default">내 사람들을 위한 나의 준비</h2>
                                </div>
                            </div>
                            <div className="elementor-element elementor-element-f5c72bd elementor-widget elementor-widget-text-editor" data-id="f5c72bd" data-element_type="widget" data-widget_type="text-editor.default">
                                <div className="elementor-widget-container">
                                    <p>
                                        내가 원하는 나의 모습으로... 내가 준비한 것들을 쉽게 알 수 있도록...<br />
                                        내가 내 사람들을 어떻게 생각했는지... 나는 평소에 어떻게 지내왔는지...<br />
                                        내사람들이 내가 생각날 때 쉽게 찾아올 수 있도록...<br />
                                        지금부터 시작하는 나의 준비
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div
                        className="elementor-element elementor-element-f8d300c e-flex e-con-boxed e-con e-parent"
                        data-id="f8d300c"
                        data-element_type="container"
                    >
                        <div className="e-con-inner">
                            <div
                                className="elementor-element elementor-element-2c8c7d6 e-con-full e-flex e-con e-child"
                                data-id="2c8c7d6"
                                data-element_type="container"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    gap: '20px',
                                    width: '100%'
                                }}
                            >
                                {items.map((item, index) => (
                                    <OriginalLinkInBio
                                        key={index}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        description={item.description}
                                        imageSrc={item.imageSrc}
                                        onClick={() => console.log(`Clicked ${item.title}`)}
                                        containerClassName={itemClasses[index]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <OriginalFooter />
            </div>

            {/* Login Modal */}
            <Modal3D isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} width="400px" height="500px">
                <LoginModal
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onSignUpClick={openSignUp}
                />
            </Modal3D>

            {/* SignUp Modal */}
            <Modal3D isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} width="400px" height="auto">
                <SignUpModal
                    onClose={() => setIsSignUpModalOpen(false)}
                    onLoginClick={openLogin}
                />
            </Modal3D>

            {/* SignUp Info Modal */}
            <Modal3D isOpen={isSignUpInfoModalOpen} onClose={() => { }} width="500px" height="auto">
                {currentUser && (
                    <SignUpInfoModal
                        onClose={() => setIsSignUpInfoModalOpen(false)}
                        onComplete={() => {
                            setIsSignUpInfoModalOpen(false);
                            navigate('/login');
                        }}
                        userId={currentUser.id}
                    />
                )}
            </Modal3D>
        </>
    );
};

export default Home;
