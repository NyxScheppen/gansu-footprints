import chapters from '../../source/chapters.json';
import fuxi from '../../assets/fuxi-temple.webp';
import bronze from '../../assets/bronze-horse.webp';
import apple from '../../assets/apples.webp';
import maiji from '../../assets/maijishan.webp';
import river from '../../assets/yellow-river.webp';

export { chapters };
export const photos = {
  fuxi: { src: fuxi, alt: '伏羲庙实景', credit: '新甘肃客户端 / 天水市融媒体中心' },
  bronze: { src: bronze, alt: '甘肃省博物馆铜奔马', credit: '新浪新闻' },
  apple: { src: apple, alt: '红苹果主题配图', credit: 'Unsplash · 苹果主题配图' },
  maiji: { src: maiji, alt: '秋色中的麦积山石窟', credit: '敦煌研究院' },
  river: { src: river, alt: '兰州黄河之滨的夕阳', credit: '华声在线' },
};
export const slides = [
  { id: 'maiji', place: 'TIANSHUI, GANSU · 麦积山', title: '山河有迹，文脉悠长', desc: '一眼千年，走近陇原的文化与生活' },
  { id: 'fuxi', place: 'TIANSHUI, GANSU · 伏羲庙', title: '羲皇故里，寻根华夏', desc: '在古建与祭典之间，读懂文明的记忆' },
  { id: 'bronze', place: 'GANSU · 青铜文明', title: '金石有声，千年回响', desc: '从铜奔马的昂扬姿态，感受古代工艺之美' },
  { id: 'apple', place: 'GANSU · 乡土新生 / 苹果配图', title: '一颗红果，一方丰收', desc: '循着花牛苹果的故事，走进乡村的日常' },
  { id: 'river', place: 'LANZHOU, GANSU · 黄河', title: '黄河奔流，万物共生', desc: '在黄河之滨，看见城市与山河相依' },
];
