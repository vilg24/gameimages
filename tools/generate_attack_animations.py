#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import random
from pathlib import Path
from typing import Dict, List

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

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
    branch_count = 7 + int(impact_core * 14)
    glow_alpha = int(65 + 160 * impact_core)
    bolt_alpha = int(90 + 160 * impact_core)

    cx = CANVAS // 2 + rng.randint(-10, 10)
    top = 54
    bottom = CANVAS - 70

    for _ in range(branch_count):
        x = cx + rng.randint(-45, 45)
        y = top + rng.randint(-8, 8)
        pts = [(x, y)]
        step_count = 9 + rng.randint(0, 6)
        for i in range(1, step_count):
            t = i / step_count
            px = cx + int(math.sin(t * 11 + rng.random() * 7) * (24 + 38 * impact_core)) + rng.randint(-14, 14)
            py = int(top + t * (bottom - top)) + rng.randint(-10, 10)
            pts.append((px, py))
        pts.append((cx + rng.randint(-36, 36), bottom + rng.randint(-14, 14)))

        width = max(1, int(2 + 9 * impact_core - rng.random() * 2))
        draw.line(pts, fill=(200, 230, 255, glow_alpha), width=width + 11)
        draw.line(pts, fill=(240, 250, 255, bolt_alpha), width=width)

    if 3 <= frame_idx <= 6:
        flash = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        fdraw = ImageDraw.Draw(flash)
        radius = 130 + (6 - abs(frame_idx - 5)) * 42
        fdraw.ellipse(
            (cx - radius, CANVAS // 2 - radius, cx + radius, CANVAS // 2 + radius),
            fill=(220, 240, 255, 190),
        )
        flash = flash.filter(ImageFilter.GaussianBlur(18))
        overlay = Image.alpha_composite(overlay, flash)

    if frame_idx >= 5:
        sparks = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(sparks)
        for _ in range(max(8, 95 - frame_idx * 9)):
            sx = cx + rng.randint(-130, 130)
            sy = CANVAS // 2 + rng.randint(-120, 120)
            sr = rng.randint(1, 5)
            sa = rng.randint(55, 190)
            sdraw.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(195, 230, 255, sa))
        sparks = sparks.filter(ImageFilter.GaussianBlur(2.2))
        overlay = Image.alpha_composite(overlay, sparks)

    return overlay


def render_lightning_frames(src: Image.Image) -> List[Image.Image]:
    frames: List[Image.Image] = []
    base = fit_source(src, 330, 330)

    for i in range(FRAME_COUNT):
        rng = random.Random(SEED + 101 + i)
        frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))

        cast = min(1.0, i / 2.0)
        strike = max(0.0, 1.0 - abs(i - 5) / 2.9)
        dissipate = max(0.0, (i - 5) / 4.0)

        scale = 0.62 + cast * 0.22 + strike * 0.4 - dissipate * 0.18
        jitter_x = rng.randint(-5, 5) + int(math.sin(i * 2.3) * (4 + 16 * strike))
        jitter_y = rng.randint(-5, 5) + int(math.cos(i * 1.9) * (4 + 14 * strike))

        cur = base.resize(
            (max(1, int(base.width * scale)), max(1, int(base.height * scale))),
            Image.Resampling.LANCZOS,
        )

        brighten = ImageEnhance.Brightness(cur).enhance(0.72 + strike * 1.0 + cast * 0.35)
        brighten = ImageEnhance.Color(brighten).enhance(1.05 + strike * 0.45)
        glow = brighten.filter(ImageFilter.GaussianBlur(14 + int(14 * strike)))
        glow_alpha = int(45 + 170 * strike + 85 * cast - 80 * dissipate)
        glow.putalpha(glow.split()[3].point(lambda a: max(0, min(255, (a * glow_alpha) // 255))))

        gx = (CANVAS - glow.width) // 2 + jitter_x
        gy = (CANVAS - glow.height) // 2 + jitter_y
        alpha_safe_paste(frame, glow, gx, gy)

        cur_alpha = int(85 + 135 * cast + 45 * strike - 85 * dissipate)
        cur = brighten.copy()
        cur.putalpha(cur.split()[3].point(lambda a: max(0, min(255, (a * cur_alpha) // 255))))
        cx = (CANVAS - cur.width) // 2 + jitter_x
        cy = (CANVAS - cur.height) // 2 + jitter_y
        alpha_safe_paste(frame, cur, cx, cy)

        overlay = draw_lightning_overlay(i, rng)
        frame = Image.alpha_composite(frame, overlay)

        if 4 <= i <= 6:
            impact_cross = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
            idraw = ImageDraw.Draw(impact_cross)
            strength = 1.0 - abs(i - 5) / 1.8
            span = int(140 + 120 * strength)
            width = int(8 + 12 * strength)
            idraw.line(
                [(CANVAS // 2 - span, CANVAS // 2), (CANVAS // 2 + span, CANVAS // 2)],
                fill=(230, 245, 255, int(80 + 120 * strength)),
                width=width,
            )
            idraw.line(
                [(CANVAS // 2, CANVAS // 2 - span), (CANVAS // 2, CANVAS // 2 + span)],
                fill=(230, 245, 255, int(80 + 120 * strength)),
                width=width,
            )
            impact_cross = impact_cross.filter(ImageFilter.GaussianBlur(7))
            frame = Image.alpha_composite(frame, impact_cross)

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
        (38, (255, 90, 16, 130)),
        (24, (255, 130, 24, 180)),
        (14, (255, 190, 45, 220)),
        (7, (255, 235, 130, 230)),
    ]:
        pts = curved_arc_points(cx, cy, 138 + band // 2, start, end, 26)
        draw.line(pts, fill=col, width=band)

    ember_count = 34 + int(62 * max(0.0, 1.0 - abs(frame_idx - 5) / 5.0))
    for _ in range(ember_count):
        ex = cx + rng.randint(-130, 130)
        ey = cy + rng.randint(-80, 120)
        r = rng.randint(1, 3)
        a = rng.randint(70, 200)
        draw.ellipse((ex - r, ey - r, ex + r, ey + r), fill=(255, rng.randint(120, 220), 40, a))

    trail = trail.filter(ImageFilter.GaussianBlur(4.2))
    frame.alpha_composite(trail)


def render_flaming_frames(src: Image.Image) -> List[Image.Image]:
    frames: List[Image.Image] = []
    base = fit_source(src, 360, 360)

    for i in range(FRAME_COUNT):
        rng = random.Random(SEED + 303 + i)
        frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))

        t = i / (FRAME_COUNT - 1)
        windup = max(0.0, 1.0 - (t / 0.28)) if t < 0.28 else 0.0
        slash = 0.0
        if 0.2 <= t <= 0.76:
            slash = (t - 0.2) / 0.56
        ember = max(0.0, (t - 0.5) / 0.5)

        angle = -74 * windup + (220 * slash)
        tx = int(-84 * windup + 118 * slash)
        ty = int(44 * windup - 62 * slash + 34 * ember)
        scale = 0.82 + 0.27 * slash

        cur = base.resize(
            (max(1, int(base.width * scale)), max(1, int(base.height * scale))),
            Image.Resampling.LANCZOS,
        )
        cur = cur.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

        brightness = 0.8 + 1.05 * max(0.0, 1.0 - abs(i - 5) / 4.0)
        cur = ImageEnhance.Brightness(cur).enhance(brightness)
        cur = ImageEnhance.Color(cur).enhance(1.2)

        if slash > 0.05:
            draw_flame_trail(frame, i, slash, rng)

        if ember > 0:
            smoke = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
            sdraw = ImageDraw.Draw(smoke)
            for _ in range(26 + int(ember * 40)):
                sx = CANVAS // 2 + rng.randint(-90, 130)
                sy = CANVAS // 2 + rng.randint(-70, 110)
                sr = rng.randint(7, 18)
                sa = int(25 + 60 * (1.0 - ember) + rng.randint(0, 35))
                sdraw.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(80, 80, 85, sa))
            smoke = smoke.filter(ImageFilter.GaussianBlur(8.5))
            frame.alpha_composite(smoke)

        motion_smear = cur.filter(ImageFilter.GaussianBlur(4.2))
        motion_smear = ImageEnhance.Brightness(motion_smear).enhance(1.12)
        glow = cur.filter(ImageFilter.GaussianBlur(12))
        glow.putalpha(glow.split()[3].point(lambda a: max(0, min(255, (a * 180) // 255))))

        x = (CANVAS - cur.width) // 2 + tx
        y = (CANVAS - cur.height) // 2 + ty
        alpha_safe_paste(frame, motion_smear, x - int(20 * slash), y + int(12 * slash))
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
