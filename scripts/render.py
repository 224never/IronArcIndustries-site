"""Render or check the two static public pages using the shared content and template."""
import argparse
import json
from html import escape
from pathlib import Path
from string import Template
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://ironarcindustries.uk"
SOURCE = ROOT / "site-source"


def render(content):
    values = {key: escape(value) for key, value in content.items() if isinstance(value, str)}
    canonical = ORIGIN + content["path"]
    metadata = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": canonical + "#webpage",
        "name": content["title"],
        "url": canonical,
        "inLanguage": content["lang"],
        "description": content["description"],
        "publisher": {
            "@type": "Organization",
            "@id": ORIGIN + "/#organization",
            "name": "IronArc Industries",
            "url": ORIGIN + "/",
            "email": "contact@ironarcindustries.uk",
        },
    }
    values.update(
        canonical=canonical,
        jsonld=json.dumps(metadata, ensure_ascii=False, indent=2).replace("<", "\\u003c"),
        subject=quote(content["subject"], safe=""),
        navLinks="".join(
            f'<a href="#{anchor}">{escape(label)}</a>'
            for anchor, label in zip(("architecture", "products", "profiles", "proof", "team"), content["nav"], strict=True)
        ),
        flow="".join(
            f'<li><strong>{escape(name)}</strong><span>{escape(label)}</span></li>'
            for name, label, _ in content["layers"]
        ),
        layerCards="".join(
            f'<article class="panel"><h3>{escape(name)}</h3><p class="role">{escape(label)}</p><p>{escape(body)}</p></article>'
            for name, label, body in content["layers"]
        ),
        applications="".join(
            f'<article class="panel"><h3>{escape(name)}</h3><p>{escape(body)}</p></article>'
            for name, body in content["applications"]
        ),
        offerCards="".join(
            f'<article class="panel"><h3>{escape(name)}</h3><p>{escape(body)}</p></article>'
            for name, body in content["offers"]
        ),
        gates="".join(
            f'<li><span class="gate-status">{escape(status)}</span><h3>{escape(level)}</h3><p>{escape(body)}</p></li>'
            for level, status, body in content["gates"]
        ),
        founderCards="".join(
            f'<article class="panel"><h3>{escape(name)}</h3><p class="role">{escape(role)}</p><p>{escape(body)}</p></article>'
            for name, role, body in content["founders"]
        ),
    )
    return Template((SOURCE / "page.html").read_text(encoding="utf-8")).substitute(values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify the committed pages match the source")
    options = parser.parse_args()
    content = json.loads((SOURCE / "content.json").read_text(encoding="utf-8"))
    for locale, path in (("en", ROOT / "index.html"), ("fr", ROOT / "fr" / "index.html")):
        page = render(content[locale])
        if options.check:
            if path.read_text(encoding="utf-8") != page:
                parser.exit(1, f"Out of date: {path.relative_to(ROOT)}. Run python3 scripts/render.py.\n")
        else:
            path.parent.mkdir(exist_ok=True)
            path.write_text(page, encoding="utf-8")


if __name__ == "__main__":
    main()
