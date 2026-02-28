#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import random
from pathlib import Path
from typing import Dict, List

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

CANVAS = 512
FRAME_COUNT = 10
FPS = 12
SHEET_COLS = 5
SHEET_ROWS = 2
PIVOT = [0.5, 0.5]
SEED = 1337

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source"
ANIM_DIR = ROOT / "assets" / "animations"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def clear_pngs(path: Path) -> None:
    if not path.exists():
        return
    for p in path.glob("*.png"):
        p.unlink()
    for p in path.glob("*.gif"):
        p.unlink()


def fit_source(src: Image.Image, max_w: int, max_h: int) -> Image.Image:
    scale = min(max_w / src.width, max_h / src.height)
    new_size = (max(1, int(src.width * scale)), max(1, int(src.height * scale)))
    return src.resize(new_size, Image.Resampling.LANCZOS)


def alpha_safe_paste(base: Image.Image, layer: Image.Image, x: int, y: int) -> None:
    base.alpha_composite(layer, (x, y))


def draw_lightning_overlay(frame_idx: int, rng: random.Random) -> Image.Image:
    overlay = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    impact_core = 1.0 - min(1.0, abs(frame_idx - 5) / 5.0)
    branch_count = 4 + int(impact_core * 7)
    glow_alpha = int(65 + 160 * impact_core)
    bolt_alpha = int(90 + 160 * impact_core)

    cx = CANVAS // 2 + rng.randint(-10, 10)
    top = 54
    bottom = CANVAS - 70

    for _ in range(branch_count):
        x = cx + rng.randint(-45, 45)
        y = top + rng.randint(-8, 8)
        pts = [(x, y)]
        step_count = 8 + rng.randint(0, 4)
        for i in range(1, step_count):
            t = i / step_count
            px = cx + int(math.sin(t * 9 + rng.random() * 4) * (18 + 26 * impact_core)) + rng.randint(-8, 8)
            py = int(top + t * (bottom - top)) + rng.randint(-10, 10)
            pts.append((px, py))
        pts.append((cx + rng.randint(-22, 22), bottom + rng.randint(-8, 8)))

        width = max(1, int(2 + 6 * impact_core - rng.random() * 2))
        draw.line(pts, fill=(200, 230, 255, glow_alpha), width=width + 6)
        draw.line(pts, fill=(240, 250, 255, bolt_alpha), width=width)

    if 4 <= frame_idx <= 6:
        flash = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        fdraw = ImageDraw.Draw(flash)
        radius = 90 + (6 - abs(frame_idx - 5)) * 30
        fdraw.ellipse(
            (cx - radius, CANVAS // 2 - radius, cx + radius, CANVAS // 2 + radius),
            fill=(220, 240, 255, 130),
        )
        flash = flash.filter(ImageFilter.GaussianBlur(12))
        overlay = Image.alpha_composite(overlay, flash)

    if frame_idx >= 6:
        sparks = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(sparks)
        for _ in range(55 - frame_idx * 4):
            sx = cx + rng.randint(-130, 130)
            sy = CANVAS // 2 + rng.randint(-120, 120)
            sr = rng.randint(1, 3)
            sa = rng.randint(55, 170)
            sdraw.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(195, 230, 255, sa))
        sparks = sparks.filter(ImageFilter.GaussianBlur(1.5))
        overlay = Image.alpha_composite(overlay, sparks)

    return overlay


def render_lightning_frames(src: Image.Image) -> List[Image.Image]:
    frames: List[Image.Image] = []
    base = fit_source(src, 300, 300)

    for i in range(FRAME_COUNT):
        rng = random.Random(SEED + 101 + i)
        frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))

        cast = min(1.0, i / 3.0)
        strike = max(0.0, 1.0 - abs(i - 5) / 4.0)
        dissipate = max(0.0, (i - 6) / 4.0)

        scale = 0.84 + cast * 0.12 + strike * 0.18 - dissipate * 0.12
        jitter_x = rng.randint(-3, 3) + int(math.sin(i * 1.4) * (2 + 6 * strike))
        jitter_y = rng.randint(-3, 3) + int(math.cos(i * 1.1) * (2 + 5 * strike))

        cur = base.resize(
            (max(1, int(base.width * scale)), max(1, int(base.height * scale))),
            Image.Resampling.LANCZOS,
        )

        brighten = ImageEnhance.Brightness(cur).enhance(0.9 + strike * 0.65 + cast * 0.25)
        glow = brighten.filter(ImageFilter.GaussianBlur(9 + int(10 * strike)))
        glow_alpha = int(70 + 120 * strike + 50 * cast - 60 * dissipate)
        glow.putalpha(glow.split()[3].point(lambda a: max(0, min(255, (a * glow_alpha) // 255))))

        gx = (CANVAS - glow.width) // 2 + jitter_x
        gy = (CANVAS - glow.height) // 2 + jitter_y
        alpha_safe_paste(frame, glow, gx, gy)

        cur_alpha = int(145 + 90 * cast + 20 * strike - 50 * dissipate)
        cur = brighten.copy()
        cur.putalpha(cur.split()[3].point(lambda a: max(0, min(255, (a * cur_alpha) // 255))))
        cx = (CANVAS - cur.width) // 2 + jitter_x
        cy = (CANVAS - cur.height) // 2 + jitter_y
        alpha_safe_paste(frame, cur, cx, cy)

        overlay = draw_lightning_overlay(i, rng)
        frame = Image.alpha_composite(frame, overlay)

        frames.append(frame)

    return frames


def curved_arc_points(center_x: int, center_y: int, radius: int, a0: float, a1: float, steps: int) -> List[tuple[int, int]]:
    pts = []
    for s in range(steps + 1):
        t = s / steps
        ang = a0 + (a1 - a0) * t
        x = center_x + int(math.cos(ang) * radius)
        y = center_y + int(math.sin(ang) * radius)
        pts.append((x, y))
    return pts


def draw_flame_trail(frame: Image.Image, frame_idx: int, sweep_t: float, rng: random.Random) -> None:
    trail = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(trail)

    cx, cy = CANVAS // 2 + 15, CANVAS // 2 + 20
    start = math.radians(215 - 58 * sweep_t)
    end = math.radians(330 - 130 * sweep_t)

    for band, col in [
        (20, (255, 120, 25, 135)),
        (12, (255, 175, 45, 170)),
        (6, (255, 228, 95, 210)),
    ]:
        pts = curved_arc_points(cx, cy, 140 + band // 2, start, end, 18)
        draw.line(pts, fill=col, width=band)

    ember_count = 18 + int(40 * max(0.0, 1.0 - abs(frame_idx - 5) / 5.0))
    for _ in range(ember_count):
        ex = cx + rng.randint(-130, 130)
        ey = cy + rng.randint(-80, 120)
        r = rng.randint(1, 3)
        a = rng.randint(70, 200)
        draw.ellipse((ex - r, ey - r, ex + r, ey + r), fill=(255, rng.randint(120, 220), 40, a))

    trail = trail.filter(ImageFilter.GaussianBlur(2.8))
    frame.alpha_composite(trail)


def render_flaming_frames(src: Image.Image) -> List[Image.Image]:
    frames: List[Image.Image] = []
    base = fit_source(src, 340, 340)

    for i in range(FRAME_COUNT):
        rng = random.Random(SEED + 303 + i)
        frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))

        t = i / (FRAME_COUNT - 1)
        windup = max(0.0, 1.0 - (t / 0.32)) if t < 0.32 else 0.0
        slash = 0.0
        if 0.22 <= t <= 0.78:
            slash = (t - 0.22) / (0.56)
        ember = max(0.0, (t - 0.58) / 0.42)

        angle = -38 * windup + (145 * slash)
        tx = int(-56 * windup + 80 * slash)
        ty = int(34 * windup - 42 * slash + 24 * ember)
        scale = 0.9 + 0.16 * slash

        cur = base.resize(
            (max(1, int(base.width * scale)), max(1, int(base.height * scale))),
            Image.Resampling.LANCZOS,
        )
        cur = cur.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

        brightness = 0.95 + 0.85 * max(0.0, 1.0 - abs(i - 5) / 5.0)
        cur = ImageEnhance.Brightness(cur).enhance(brightness)

        if slash > 0.05:
            draw_flame_trail(frame, i, slash, rng)

        if ember > 0:
            smoke = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
            sdraw = ImageDraw.Draw(smoke)
            for _ in range(16 + int(ember * 20)):
                sx = CANVAS // 2 + rng.randint(-90, 130)
                sy = CANVAS // 2 + rng.randint(-70, 110)
                sr = rng.randint(7, 18)
                sa = int(25 + 60 * (1.0 - ember) + rng.randint(0, 35))
                sdraw.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(80, 80, 85, sa))
            smoke = smoke.filter(ImageFilter.GaussianBlur(6.0))
            frame.alpha_composite(smoke)

        glow = cur.filter(ImageFilter.GaussianBlur(8))
        glow.putalpha(glow.split()[3].point(lambda a: max(0, min(255, (a * 145) // 255))))

        x = (CANVAS - cur.width) // 2 + tx
        y = (CANVAS - cur.height) // 2 + ty
        alpha_safe_paste(frame, glow, (CANVAS - glow.width) // 2 + tx, (CANVAS - glow.height) // 2 + ty)
        alpha_safe_paste(frame, cur, x, y)

        frames.append(frame)

    return frames


def write_frames(effect_dir: Path, effect_name: str, frames: List[Image.Image]) -> List[Path]:
    frame_dir = effect_dir / "frames"
    ensure_dir(frame_dir)
    clear_pngs(frame_dir)
    out_paths: List[Path] = []

    for i, frame in enumerate(frames):
        path = frame_dir / f"{effect_name}_{i:03d}.png"
        frame.save(path)
        out_paths.append(path)

    return out_paths


def write_sheet(effect_dir: Path, effect_name: str, frames: List[Image.Image]) -> Path:
    sheet_dir = effect_dir / "spritesheet"
    ensure_dir(sheet_dir)
    clear_pngs(sheet_dir)

    sheet = Image.new("RGBA", (CANVAS * SHEET_COLS, CANVAS * SHEET_ROWS), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        col = i % SHEET_COLS
        row = i // SHEET_COLS
        sheet.alpha_composite(frame, (col * CANVAS, row * CANVAS))

    path = sheet_dir / f"{effect_name}_sheet.png"
    sheet.save(path)
    return path


def write_json(effect_dir: Path, effect_name: str) -> Path:
    frames_meta = []
    for i in range(FRAME_COUNT):
        col = i % SHEET_COLS
        row = i // SHEET_COLS
        frames_meta.append(
            {
                "file": f"frames/{effect_name}_{i:03d}.png",
                "index": i,
                "rect": [col * CANVAS, row * CANVAS, CANVAS, CANVAS],
            }
        )

    data: Dict[str, object] = {
        "name": effect_name,
        "fps": FPS,
        "frame_size": [CANVAS, CANVAS],
        "frames": frames_meta,
        "sheet": {
            "file": f"spritesheet/{effect_name}_sheet.png",
            "cols": SHEET_COLS,
            "rows": SHEET_ROWS,
        },
        "pivot": PIVOT,
    }

    path = effect_dir / f"{effect_name}.json"
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return path


def write_gif(effect_dir: Path, effect_name: str, frames: List[Image.Image]) -> Path:
    preview_dir = effect_dir / "preview"
    ensure_dir(preview_dir)
    clear_pngs(preview_dir)

    path = preview_dir / f"{effect_name}.gif"
    duration_ms = int(1000 / FPS)

    rgba_frames = [f.copy() for f in frames]
    rgba_frames[0].save(
        path,
        save_all=True,
        append_images=rgba_frames[1:],
        duration=duration_ms,
        loop=0,
        disposal=2,
        optimize=False,
        transparency=0,
    )
    return path


def validate(effect_name: str, frame_paths: List[Path]) -> None:
    if len(frame_paths) != FRAME_COUNT:
        raise RuntimeError(f"{effect_name}: expected {FRAME_COUNT} frames, got {len(frame_paths)}")

    for i, path in enumerate(frame_paths):
        expected = f"{effect_name}_{i:03d}.png"
        if path.name != expected:
            raise RuntimeError(f"{effect_name}: bad frame name {path.name}, expected {expected}")

        img = Image.open(path).convert("RGBA")
        if img.size != (CANVAS, CANVAS):
            raise RuntimeError(f"{effect_name}: frame {path.name} has wrong size {img.size}")
        alpha = img.getchannel("A")
        amin, amax = alpha.getextrema()
        if amax == 0:
            raise RuntimeError(f"{effect_name}: frame {path.name} is fully transparent")
        if amin == 255:
            raise RuntimeError(f"{effect_name}: frame {path.name} has no transparency")


def generate_effect(effect_name: str, src_file: str, renderer) -> Dict[str, Path]:
    src_path = SOURCE_DIR / src_file
    if not src_path.exists():
        raise FileNotFoundError(f"Missing source image: {src_path}")

    effect_dir = ANIM_DIR / effect_name
    ensure_dir(effect_dir)

    src = Image.open(src_path).convert("RGBA")
    frames = renderer(src)

    frame_paths = write_frames(effect_dir, effect_name, frames)
    sheet_path = write_sheet(effect_dir, effect_name, frames)
    json_path = write_json(effect_dir, effect_name)
    gif_path = write_gif(effect_dir, effect_name, frames)

    validate(effect_name, frame_paths)

    return {
        "source": src_path,
        "frames_dir": effect_dir / "frames",
        "sheet": sheet_path,
        "json": json_path,
        "gif": gif_path,
    }


def main() -> None:
    random.seed(SEED)
    ensure_dir(ANIM_DIR)

    lightning = generate_effect(
        "lightning_attack",
        "lightning_anime_source.png",
        render_lightning_frames,
    )
    flame = generate_effect(
        "flaming_sword_slash",
        "flaming_sword_source.png",
        render_flaming_frames,
    )

    print("Generated attack animation assets:")
    for item in (lightning, flame):
        print(f"- Source: {item['source']}")
        print(f"  Frames: {item['frames_dir']}")
        print(f"  Sheet:  {item['sheet']}")
        print(f"  JSON:   {item['json']}")
        print(f"  GIF:    {item['gif']}")


if __name__ == "__main__":
    main()
