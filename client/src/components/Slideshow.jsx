import React, { useState, useCallback, useRef } from "react";

// List of real images from the dataset folder
const imageList = [
  "1003530005.png","100604128.jpg","1007522291.jpg","1010804755.jpg","1014683983.jpg","1064427148.jpg","1067498964.jpg","1096196127.jpg","1098754089.jpg","1169702441.jpg","1174862395.jpg","1180033506.jpg","1180539354.jpg","1181194852.jpg","1200919418.jpg","1203322303.jpg","1235862615.jpg","1246965684.jpg","1254659322.jpg","1260082503.jpg","126758862.jpg","12838308_079_359b.jpg","1374786785.jpg","1381563371.jpg","1398217652.jpg","141723092.jpg","1432685950.jpg","1434347940.jpg","1436572006.jpg","1445174500.jpg","145922330.jpg","1464663246.jpg","1471342848.jpg","1516698361.jpg","1522593811.jpg","1526140333.jpg","1545193977.jpg","1546369519.jpg","1554051002.jpg","155530352.jpg","1563168086.jpg","1581273796.jpg","1593824560.jpg","1621437800.jpg","164142192.jpg","1650294388.jpg","1652850802.jpg","1655727914.jpg","1663364113.jpg","1668308142.jpg","1669301586.jpg","1675607837.jpg","1734257734.jpg","1748406165.jpg","1750345466.jpg","1778108670.jpg","1778574434.jpg","1779033723.jpg","1789427087.jpg","1792327214.jpg","1799240563.jpg","1818443001.jpg","1819298600.jpg","184876970.jpg","1850130294.jpg","1855440935.jpg","187098037.png","1908606227.jpg","1917158925.jpg","1919093904.jpg","192604889.jpg","1974464453.jpg","1987763564.jpg","200958973.jpg","200985124.jpg","2036722673.jpg","2037812710.jpg","2077971223.jpg","2080515799.jpg","2081977896.jpg","2135807910.jpg","240560149.jpg","267977316.jpg","277707204.jpg","337239586.jpg","342049142.jpg","3450197.jpg","354031856.jpg","366516512.jpg","375790918.jpg","384876990.jpg","403099891.jpg","413252193.jpg","415704078.jpg","422164456.jpg","437368060.jpg","448861133.jpg","493472268.jpg","51249762_006_254c.jpg","54133571_020_9e60.jpg","54133571_034_35bf.jpg","575470392.jpg","605027761.jpg","605525569.jpg","613487669.jpg","626366712.jpg","644455788.jpg","64945883_014_fc0f.jpg","64945883_023_21df.jpg","64945883_056_105d.jpg","64945883_069_c79a.jpg","64945883_138_c423.jpg","677879590.jpg","70430852_001_cf61.jpg","70430852_004_59b7.jpg","70430852_006_c5f3.jpg","70430852_016_9d5b.jpg","70430852_019_0709.jpg","70430852_020_f383.jpg","70430852_025_1657.jpg","716432794.jpg","72493512_008_b4fa.jpg","72493512_033_f407.jpg","72493512_064_dc7e.jpg","72493512_077_8315.jpg","72493512_126_1a25.jpg","72493512_146_926e.jpg","72493512_161_13f9.jpg","748497822.jpg","843036178.jpg","844135361.jpg","853449460.jpg","86268107_025_df21.jpg","86268107_035_edfe.jpg","86268107_042_73da.jpg","86778268_001_132f.jpg","86778268_013_3286.jpg","86778268_034_f97a.jpg","86778268_054_0b4e.jpg","86778268_062_3aee.jpg","86778268_093_7f69.jpg","86778268_107_2ccc.jpg","86778268_115_9491.jpg","880884896.jpg","889955060.jpg","894707342.jpg","905971774.png","908240629.jpg","90889934.jpg","92942575_004_4c2f.jpg","959533908.jpg","970795224.jpg","979240074.jpg","Screenshot 2025-04-14 105015.png","Screenshot 2025-04-14 105201.png","Screenshot 2025-04-14 105220.png"
];

const basePath = "/slideshow-dataset/jessie-rogers/";

export default function Slideshow() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const prevImage = useCallback(() => {
    setIndex(i => (i - 1 + imageList.length) % imageList.length);
  }, []);

  const nextImage = useCallback(() => {
    setIndex(i => (i + 1) % imageList.length);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prevImage, nextImage]);

  // Mobile swipe navigation
  const handleTouchStart = e => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = e => {
    touchEndX.current = e.changedTouches[0].clientX;
    const dx = touchEndX.current - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) prevImage();
      else nextImage();
    }
  };

  const imageUrl = basePath + imageList[index];

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/95 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={imageUrl}
        alt={imageList[index]}
        className="max-h-[90vh] max-w-[98vw] object-contain rounded shadow-lg transition-all duration-300"
        draggable={false}
      />
      {/* Navigation arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white/70 hover:text-white px-3 py-2 md:px-4 md:py-3 rounded-lg bg-black/10 md:bg-transparent focus:outline-none active:scale-95"
        style={{ touchAction: 'manipulation' }}
        onClick={prevImage}
        aria-label="Previous"
      >&#8592;</button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white/70 hover:text-white px-3 py-2 md:px-4 md:py-3 rounded-lg bg-black/10 md:bg-transparent focus:outline-none active:scale-95"
        style={{ touchAction: 'manipulation' }}
        onClick={nextImage}
        aria-label="Next"
      >&#8594;</button>
      {/* Progress indicator */}
      <div className="absolute bottom-4 flex gap-1 justify-center w-full">
        {imageList.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white/90" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
