import React from 'react';

interface LinkInBioProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc?: string;
    onClick?: () => void;
    containerClassName?: string;
}

const OriginalLinkInBio: React.FC<LinkInBioProps> = ({ title, subtitle, description, imageSrc, onClick, containerClassName }) => {
    return (
        <div className={`elementor-element elementor-widget elementor-widget-link-in-bio-var-3 ${containerClassName || ''}`} data-element_type="widget" data-widget_type="link-in-bio-var-3.default" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="elementor-widget-container">
                <div className="e-link-in-bio e-link-in-bio-var-3 has-border">
                    <div className="e-link-in-bio__content">
                        <div className="e-link-in-bio__identity">
                            <div className="e-link-in-bio__identity-image e-link-in-bio__identity-image-profile has-style-circle">
                                <img alt={title} className="e-link-in-bio__identity-image-element" src={imageSrc || "/images/elementor-images-placeholder.png"} />
                            </div>
                        </div>
                        <div className="e-link-in-bio__bio">
                            <h2 className="e-link-in-bio__heading">{title}</h2>
                            <h3 className="e-link-in-bio__title">{subtitle}</h3>
                            <p className="e-link-in-bio__description">{description}</p>
                        </div>
                        <div className="e-link-in-bio__icons has-size-small">
                            <div className="e-link-in-bio__icon is-size-small">
                                <a target="_blank" rel="noopener noreferrer" aria-label="Vimeo" className="e-link-in-bio__icon-link" href="#">
                                    <span className="e-link-in-bio__icon-svg">
                                        <svg aria-hidden="true" className="e-font-icon-svg e-fab-vimeo-v" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 250 85.3 174.3 56.2 174.3c-3.4 0-15.1 7.1-35.2 21.1L0 168.2c51.6-45.3 100.9-95.7 131.8-98.5 34.9-3.4 56.3 20.5 64.4 71.5 28.7 181.5 41.4 208.9 93.6 126.7 18.7-29.6 28.8-52.1 30.2-67.6 4.8-45.9-35.8-42.8-63.3-31 22-72.1 64.1-107.1 126.2-105.1 45.8 1.2 67.5 31.1 64.9 89.4z"></path></svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div className="e-link-in-bio__ctas has-type-button">
                            {/* CTA button placeholder if needed */}
                        </div>
                    </div>
                    <div className="e-link-in-bio__bg">
                        <div className="e-link-in-bio__bg-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OriginalLinkInBio;
