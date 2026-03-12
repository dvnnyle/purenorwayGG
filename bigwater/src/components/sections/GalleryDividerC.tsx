import "./GalleryDividerC.css";

interface GalleryDividerCProps {
  bigImage?: string;
  topImage?: string;
  bottomImage?: string;
}

export default function GalleryDividerC({
  bigImage = "/assets/images/norgeFjords_extended.jpeg",
  topImage = "/assets/images/norgeFjords.jpeg",
  bottomImage = "/assets/images/sandNorway.jpg",
}: GalleryDividerCProps) {
  return (
    <div className="gallery-divider-c-wrap">
      <div className="gallery-divider-c">
        <div className="gdc-big">
          <img src={bigImage} alt="Norway landscape" />
        </div>
        <div className="gdc-small">
          <div className="gdc-small-img">
            <img src={topImage} alt="Norwegian fjord" />
          </div>
          <div className="gdc-small-img">
            <img src={bottomImage} alt="Norwegian coast" />
          </div>
        </div>
      </div>
    </div>
  );
}
