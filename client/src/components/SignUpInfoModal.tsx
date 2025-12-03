import React, { useState } from 'react';

interface SignUpInfoModalProps {
    onClose: () => void;
    onComplete: () => void;
    userId: number; // We need to know which user to update
}

const SignUpInfoModal: React.FC<SignUpInfoModalProps> = ({ onClose, onComplete, userId }) => {
    const [step, setStep] = useState(1); // 1: Basic Info, 2: Death Certifiers, 3: Insurance
    const [formData, setFormData] = useState({
        birthdate: '',
        address: '',
        detail_address: '',
        zipcode: '',
        death_certifier_1_name: '',
        death_certifier_1_phone: '',
        death_certifier_1_relation: '',
        death_certifier_2_name: '',
        death_certifier_2_phone: '',
        death_certifier_2_relation: '',
        insurance_status: 'not_joined', // 'joined', 'not_joined', 'consultation_requested'
        insurance_name: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.birthdate || !formData.address) {
                setError('필수 정보를 모두 입력해주세요.');
                return;
            }
        } else if (step === 2) {
            if (!formData.death_certifier_1_name || !formData.death_certifier_1_phone || !formData.death_certifier_2_name || !formData.death_certifier_2_phone) {
                setError('사망 확인인 2명의 정보를 모두 입력해주세요.');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handlePrev = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/users/${userId}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // We might need token here if we use auth middleware
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert('정보가 성공적으로 저장되었습니다.');
                onComplete();
            } else {
                setError(data.error || '저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError('서버 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontFamily: "'Noto Sans KR', sans-serif",
            padding: '20px',
            overflowY: 'auto'
        }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    추가 정보 입력 ({step}/3)
                </h2>

                {step === 1 && (
                    <>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>기본 정보</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>생년월일</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>주소</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="기본 주소"
                                value={formData.address}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '5px' }}
                            />
                            <input
                                type="text"
                                name="detail_address"
                                placeholder="상세 주소"
                                value={formData.detail_address}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>사망 확인인 정보 (필수)</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                            본인의 사망 소식을 확인해 줄 지인 2명의 정보를 입력해주세요.<br />
                            이 분들의 확인이 있어야 유언 및 메시지가 전달됩니다.
                        </p>

                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>확인인 1</h4>
                            <input
                                type="text"
                                name="death_certifier_1_name"
                                placeholder="이름"
                                value={formData.death_certifier_1_name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '5px' }}
                            />
                            <input
                                type="tel"
                                name="death_certifier_1_phone"
                                placeholder="연락처"
                                value={formData.death_certifier_1_phone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '5px' }}
                            />
                            <input
                                type="text"
                                name="death_certifier_1_relation"
                                placeholder="관계 (예: 가족, 친구)"
                                value={formData.death_certifier_1_relation}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>확인인 2</h4>
                            <input
                                type="text"
                                name="death_certifier_2_name"
                                placeholder="이름"
                                value={formData.death_certifier_2_name}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '5px' }}
                            />
                            <input
                                type="tel"
                                name="death_certifier_2_phone"
                                placeholder="연락처"
                                value={formData.death_certifier_2_phone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '5px' }}
                            />
                            <input
                                type="text"
                                name="death_certifier_2_relation"
                                placeholder="관계 (예: 가족, 친구)"
                                value={formData.death_certifier_2_relation}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>보험/상조 가입 여부 (선택)</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>가입 상태</label>
                            <select
                                name="insurance_status"
                                value={formData.insurance_status}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            >
                                <option value="not_joined">미가입</option>
                                <option value="joined">가입함</option>
                                <option value="consultation_requested">상담 요청</option>
                            </select>
                        </div>
                        {formData.insurance_status === 'joined' && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>가입 상품명/회사</label>
                                <input
                                    type="text"
                                    name="insurance_name"
                                    value={formData.insurance_name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                />
                            </div>
                        )}
                    </>
                )}

                {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {step > 1 && (
                        <button
                            onClick={handlePrev}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#ddd',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            이전
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#333',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            다음
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#333',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            완료
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUpInfoModal;
