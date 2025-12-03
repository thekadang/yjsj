import React, { useState } from 'react';
import MySpaceHeader from '../components/MySpaceHeader';
import MySpacePre from '../components/myspace/MySpacePre';
import MySpacePost from '../components/myspace/MySpacePost';
import FriendSpacePre from '../components/myspace/FriendSpacePre';
import FriendSpacePost from '../components/myspace/FriendSpacePost';

type ViewType = 'my-pre' | 'my-post' | 'friend-pre' | 'friend-post';

const MySpace: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('my-pre');

    // Mini-hompy Style Container
    const containerStyle: React.CSSProperties = {
        width: '1280px',
        height: '85vh',
        margin: '20px auto',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        overflowY: 'auto',
        position: 'relative',
        padding: '20px'
    };

    const renderContent = () => {
        switch (activeView) {
            case 'my-pre':
                return <MySpacePre />;
            case 'my-post':
                return <MySpacePost />;
            case 'friend-pre':
                return <FriendSpacePre />;
            case 'friend-post':
                return <FriendSpacePost />;
        }
    };

    return (
        <>
            <MySpaceHeader />
            <div style={{ backgroundColor: '#f0f0f0', minHeight: 'calc(100vh - 100px)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Temporary View Selector */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => setActiveView('my-pre')} style={{ padding: '10px', backgroundColor: activeView === 'my-pre' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px' }}>내 공간 (사전)</button>
                    <button onClick={() => setActiveView('my-post')} style={{ padding: '10px', backgroundColor: activeView === 'my-post' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px' }}>내 공간 (사후)</button>
                    <button onClick={() => setActiveView('friend-pre')} style={{ padding: '10px', backgroundColor: activeView === 'friend-pre' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px' }}>친구 공간 (사전)</button>
                    <button onClick={() => setActiveView('friend-post')} style={{ padding: '10px', backgroundColor: activeView === 'friend-post' ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px' }}>친구 공간 (사후)</button>
                </div>

                {/* Mini-hompy Window */}
                <div style={containerStyle}>
                    <div data-elementor-type="single-page" data-elementor-id="33" className="elementor elementor-33 elementor-location-single post-12 page type-page status-publish hentry" data-elementor-post-type="elementor_library">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MySpace;
