cd public/images/portfolio

mkdir -p thumbs full

mogrify -path thumbs -resize 600x -format webp -quality 75 *.jpg

mogrify -path full -resize 2000x -format webp -quality 82 *.jpg

mogrify -strip thumbs/*.webp
mogrify -strip full/*.webp




cd public/images/portfolio && \
for cat in originals/*; do \
  [ -d "$cat" ] || continue; \
  c="$(basename "$cat")"; \
  mkdir -p "thumbs/$c" "full/$c"; \
  /opt/local/bin/mogrify -path "thumbs/$c" -resize 600x  -format webp -quality 75  "$cat"/*.jpg 2>/dev/null; \
  /opt/local/bin/mogrify -path "full/$c"   -resize 2000x -format webp -quality 82  "$cat"/*.jpg 2>/dev/null; \
  /opt/local/bin/mogrify -strip "thumbs/$c"/*.webp 2>/dev/null; \
  /opt/local/bin/mogrify -strip "full/$c"/*.webp   2>/dev/null; \
done



oops every category folder inside originals/

Creates matching thumbs/<Category> + full/<Category>

Converts JPG → WebP

Makes thumbnails 600px wide + full images 2000px wide

Strips metadata (privacy + smaller files)

Leaves your original .jpg untouched ✅

Quick check (see what was generated)
ls -R public/images/portfolio/thumbs | head
ls -R public/images/portfolio/full | head