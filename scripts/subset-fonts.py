"""从 source-assets 中的完整字体生成当前站点所需的 WOFF2。"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-assets/public/fonts"
OUTPUT = ROOT / "public/fonts"
TEXT_FILES = [
    file
    for directory in ("app", "components", "lib")
    for file in (ROOT / directory).rglob("*")
    if file.suffix in {".ts", ".tsx", ".css", ".json"}
]
TEXT_FILES.append(ROOT / "figma-media.json")
GLYPHS = set(chr(code) for code in range(32, 127))
for file in TEXT_FILES:
    GLYPHS.update(file.read_text(encoding="utf-8-sig"))


def save_font(source_name: str, subset_to_site: bool = True) -> None:
    font = TTFont(SOURCE / source_name)
    if subset_to_site:
        options = subset.Options()
        options.layout_features = ["*"]
        options.notdef_glyph = True
        options.notdef_outline = True
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(text="".join(GLYPHS))
        subsetter.subset(font)
    font.flavor = "woff2"
    destination = OUTPUT / Path(source_name).with_suffix(".woff2")
    font.save(destination)
    print(f"{destination.name}: {destination.stat().st_size // 1024} KB")


OUTPUT.mkdir(parents=True, exist_ok=True)
save_font("HONORSansCN-Regular.ttf")
save_font("HONORSansCN-DemiBold.ttf")
save_font("GenWanMinTW-SemiBold.ttf")
save_font("Adobe-Jenson-Pro-Regular.otf", subset_to_site=False)
