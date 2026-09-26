"""Rebuild the S3 photo folder for beaujb-website from the hashed images in master.

Usage (from a checkout of master, which still holds the original photos):
    pip install pillow
    python3 scripts/build-s3-upload.py . s3-upload
Then: aws s3 sync s3-upload/ s3://beaujb-website/
"""
import sys, os, glob, shutil
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
m = {
"profile/cover-photo":"cover-photo",
"favorites/anime/digimon":"Digimon","favorites/anime/fate":"fsn-wide","favorites/anime/fmab":"fma-wide",
"favorites/anime/haikyuu":"haikyuu","favorites/anime/no-game-no-life":"no-game-no-life",
"favorites/anime/oregairu":"yahari-ore-no-seishun-love-comedy-wa-machigatteiru",
"favorites/anime/rent-a-girlfriend":"rent-a-girlfriend","favorites/anime/sakurasou":"sakura-sou-no-pet-na-kanojo",
"favorites/anime/sao":"sao-wide","favorites/anime/spirited-away":"spirited away-wide",
"favorites/food/bbq":"bbq-wide","favorites/food/dumplings":"dumplings-wide","favorites/food/hot-chicken":"hot-chicken-wide",
"favorites/food/nanay":"nanay-wide","favorites/food/poke":"official-pokinometry-wide","favorites/food/ramen":"japan-ramen-wide",
"favorites/food/tacos":"los_tacos-wide",
"favorites/games/arknights":"arknights-wide","favorites/games/counter-strike":"cs-wide","favorites/games/kingdom-hearts":"kingdom-hearts",
"favorites/games/league-of-legends":"lol-wide","favorites/games/maplestory":"maplestory","favorites/games/nba2k":"nba2k",
"favorites/games/overwatch":"ow","favorites/games/smash-bros":"ssb","favorites/games/valorant":"valorant","favorites/games/wow":"wow",
"favorites/movies/21-jump-street":"21-jump-street","favorites/movies/avengers":"avengers","favorites/movies/crazy-stupid-love":"crazy-stupid-love",
"favorites/movies/fast-5":"fast-5","favorites/movies/httyd":"httyd","favorites/movies/inside-out":"inside-out",
"favorites/movies/lilo-stitch":"lilo-stitch","favorites/movies/martian":"martian","favorites/movies/rush-hour":"rush-hour",
"favorites/movies/social-network":"social-network",
"favorites/music/ariana-grande":"ari-g","favorites/music/avicii":"avicii","favorites/music/blackpink":"blackpink",
"favorites/music/childish-gambino":"childish-gambino","favorites/music/ed-sheeran":"ed-sheeran","favorites/music/illenium":"ILLENIUM",
"favorites/music/iu":"iu","favorites/music/kygo":"kygo","favorites/music/twice":"twice","favorites/music/zedd":"zedd",
"favorites/shows/atla-lok":"atla-lok-wide","favorites/shows/brooklyn-nine-nine":"b99","favorites/shows/modern-family":"modern-family",
"favorites/shows/mr-robot":"mr-robot","favorites/shows/newsroom":"newsroom","favorites/shows/sex-education":"sex-education",
"favorites/shows/silicon-valley":"silicon-valley","favorites/shows/suits":"suits","favorites/shows/teen-titans":"teen-titans",
"favorites/shows/young-justice":"young-justice",
"favorites/sports/badminton":"badminton-wide","favorites/sports/basketball":"rhs-bball-wide","favorites/sports/biking":"biking-wide",
"favorites/sports/bowling":"bowling-wide","favorites/sports/esports":"faker-marin-wide","favorites/sports/fishing":"fishing",
"favorites/sports/golf":"golf-wide","favorites/sports/gsw":"gsw-wide","favorites/sports/snowboarding":"snowboarding-wide",
"favorites/sports/tennis":"fedal",
"favorites/travel/amsterdam":"amsterdam-wide","favorites/travel/dubai":"dubai-wide","favorites/travel/japan":"japan-wide",
"favorites/travel/philippines":"philippines-wide","favorites/travel/switzerland":"switzerland-me-wide","favorites/travel/uganda":"uganda-wide",
}
keys = list(m)
for k,stem in m.items():
    hits = glob.glob(os.path.join(src, glob.escape(stem)+".????????.*"))
    assert len(hits)==1, (k,hits)
    f = hits[0]; dst = os.path.join(out, k+".jpg"); os.makedirs(os.path.dirname(dst), exist_ok=True)
    if f.lower().endswith(".png"):
        im = Image.open(f).convert("RGB"); im.save(dst, "JPEG", quality=88, optimize=True); print("converted", os.path.basename(f), "->", k+".jpg")
    else:
        shutil.copy2(f, dst)
print("done", len(m))
