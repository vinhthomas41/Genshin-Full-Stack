import PolygonBackground from "./polygonBackground";

export default function SiteBackground() {
  return (
    <div className="site-background" aria-hidden="true">
      <div className="archive-nebula" />
      <div className="starfield starfield-far" />
      <div className="starfield starfield-near" />
      <PolygonBackground />
    </div>
  );
}
