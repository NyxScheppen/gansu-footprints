import geo from '../../../source/gansu-geo.json';
import { chapters } from '../data.js';

const polygonsOf = geometry => geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
const allPoints = geo.features.flatMap(feature => polygonsOf(feature.geometry).flat(2));
const minLon = Math.min(...allPoints.map(point => point[0]));
const maxLon = Math.max(...allPoints.map(point => point[0]));
const minLat = Math.min(...allPoints.map(point => point[1]));
const maxLat = Math.max(...allPoints.map(point => point[1]));
const scale = Math.min(490 / ((maxLon - minLon) * .8), 275 / (maxLat - minLat));
const ox = (580 - (maxLon - minLon) * .8 * scale) / 2;
const oy = (330 - (maxLat - minLat) * scale) / 2;
const project = (lon, lat) => [+(ox + (lon - minLon) * .8 * scale).toFixed(1), +(oy + (maxLat - lat) * scale).toFixed(1)];
const outlines = geo.features.map(feature => ({
  name: feature.properties.name,
  d: polygonsOf(feature.geometry).flatMap(polygon => polygon.map(ring => 'M' + ring.map(point => project(...point).join(',')).join('L') + 'Z')).join(''),
}));
const cityByChapter = { fuxi: '天水市', bronze: '武威市', apple: '天水市', maiji: '天水市', river: '兰州市' };
const positions = [[105.71, 34.58, -8, -5, -27, -22, 'end'], [102.64, 37.93, 0, 0, -17, -13, 'end'], [105.96, 34.53, 10, -6, 28, -20, 'start'], [106, 34.35, 9, 12, 30, 33, 'start'], [103.83, 36.06, 0, 0, 21, -12, 'start']];

export default function GansuMap({ chapter }) {
  return <svg viewBox="0 0 580 350" role="img" aria-label={chapter ? '甘肃省内主题位置示意图' : '甘肃主题地点示意图'}>
    {outlines.map(outline => <path key={outline.name} className={'province' + (cityByChapter[chapter] === outline.name ? ' location-highlight' : '')} d={outline.d}><title>{outline.name}</title></path>)}
    {chapters.map((item, index) => {
      if (chapter && item.id !== chapter) return null;
      const [lon, lat, dx, dy, tx, ty, anchor] = positions[index];
      const [x, y] = project(lon, lat);
      const marker = <>{!chapter && <line x1={x + dx} y1={y + dy} x2={x + tx} y2={y + ty} />}<circle cx={x + dx} cy={y + dy} r={chapter ? 7 : 6} /><text x={x + tx} y={y + ty} textAnchor={anchor}>{item.name}</text></>;
      return chapter ? <g className="map-marker" key={item.id}>{marker}</g> : <a key={item.id} href={`${item.id}.html`} className="map-marker" aria-label={`探索${item.name}`}>{marker}</a>;
    })}
  </svg>;
}
