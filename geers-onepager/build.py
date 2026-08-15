#!/usr/bin/env python3
"""Buduje one pager Geers dla lekarzy: wstrzykuje fonty TWK Lausanne i logo jako base64."""
import base64
import pathlib

HERE = pathlib.Path(__file__).parent
BRAND = pathlib.Path.home() / "SONOVA_BRAND_LANDINGS"
ASSETS = pathlib.Path(
    "/private/tmp/claude-501/-Users-reszek-Desktop-Claude-zadania-Narzedzie-do-briefowania"
    "/35190022-43c9-4667-a454-c3ea467ca97f/scratchpad/onepager"
)


def b64(path: pathlib.Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def main() -> None:
    template = (HERE / "template.html").read_text(encoding="utf-8")
    out = (
        template.replace("{{FONT_300}}", b64(BRAND / "TWKLausanne-300.ttf"))
        .replace("{{FONT_350}}", b64(BRAND / "TWKLausanne-350.otf"))
        .replace("{{FONT_500}}", b64(BRAND / "TWKLausanne-500.otf"))
        .replace("{{LOGO}}", b64(ASSETS / "geers-logo.png"))
    )
    target = HERE / "index.html"
    target.write_text(out, encoding="utf-8")
    print(f"zbudowano {target} ({target.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
