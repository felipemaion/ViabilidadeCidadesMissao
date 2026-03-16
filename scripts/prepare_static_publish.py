#!/usr/bin/env python3

import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "dashboard"
DIST_DIR = ROOT / "dist"


def main():
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)

    shutil.copytree(SOURCE_DIR, DIST_DIR)
    (DIST_DIR / ".nojekyll").write_text("", encoding="utf-8")

    print("Pacote estático preparado com sucesso.")
    print(f"Origem: {SOURCE_DIR}")
    print(f"Destino: {DIST_DIR}")


if __name__ == "__main__":
    main()
