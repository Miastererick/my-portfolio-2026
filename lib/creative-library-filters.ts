type LibraryResource = { name: string; styleDescription: string; description: string; useCases: string };

const STYLE_RULES: [string, RegExp][] = [
  ["摄影写实", /photo|photograph|photoreal|snapshot|realistic|摄影|写实/iu],
  ["手绘插画", /illustrat|hand.draw|doodle|scribble|marker|manga|anime|comic|cartoon|sketch|crayon|手绘|插画|线稿|手写/iu],
  ["拼贴混合", /collage|cutout|cut.out|fragment|assemblage|photomontage|overlay|torn|拼贴/iu],
  ["文字排版", /typograph|letter|headline|megatype|glyph|标题|字体|字图|标签/iu],
  ["复古印刷", /retro|analog|halftone|xerox|photocop|newsprint|newspaper|riso|screen.print|nostalgic|distress|复古|旧纸|半调|颗粒/iu],
  ["极简留白", /minimal|sparse|negative space|quiet|restrained|留白/iu],
  ["3D 立体", /\b3d\b|c4d|isometric|chrome|glass|sculptural|立体|三维/iu],
  ["科技未来", /future|tech|hardware|hud|interface|blueprint|engineering|科技|技术/iu],
  ["街头潮流", /streetwear|street.fashion|y2k|grunge|graffiti|hip.hop|skate|punk|街头|潮流/iu],
];
const APPLICATION_RULES: [string, RegExp][] = [
  ["产品广告", /product|advertis|\bad\b|gear|footwear|shoe|sneaker|gadget|furniture|toy|商业产品|产品广告/iu],
  ["品牌宣传", /brand|campaign|identity|品牌/iu],
  ["活动海报", /event|festival|flyer|music|concert|活动/iu],
  ["餐饮美食", /food|beverage|drink|snack|produce|grocer|菜谱|菜品|食谱|美食|食材/iu],
  ["时尚运动", /sport|athlet|fashion|streetwear|footwear|shoe|skate|motorsport|运动|时尚/iu],
  ["文旅生活", /travel|touris|landmark|destination|city|urban|transit|metro|subway|outdoor|hiking|home|lifestyle|文旅|生活/iu],
  ["编辑叙事", /editorial|magazine|cover|book|zine|diary|story|stories|portrait|dossier|storyboard|编辑|叙事/iu],
  ["公益科普", /\bpsa\b|public.service|civic|warning|technical|process|construction|specification|spec |公益|科普/iu],
];
export const LIBRARY_CATEGORIES = ["全部", ...STYLE_RULES.map(([label]) => label), ...APPLICATION_RULES.map(([label]) => label)];
export type LibraryCategory = string;

export function getCreativeLibraryCategories(item: LibraryResource): LibraryCategory[] {
  const source = `${item.name} ${item.styleDescription} ${item.description}`;
  const styles = STYLE_RULES.filter(([, pattern]) => pattern.test(source)).map(([label]) => label);
  const applications = APPLICATION_RULES.filter(([, pattern]) => pattern.test(source)).map(([label]) => label);
  return [...styles, ...applications];
}
