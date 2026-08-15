#!/bin/bash
set -e
cd "$(dirname "$0")"

# ultra cut: 6 segments x 3.6s, faster text-in, then endcard; VO mixed over ducked ambient
for i in 1 2 3 4 5 6; do
  ffmpeg -y -v error -i "u$i.mp4" -loop 1 -t 3.6 -i "ov2$i.png" \
    -filter_complex "[0:v]trim=0:3.6,setpts=PTS-STARTPTS[v];[0:a]atrim=0:3.6,asetpts=PTS-STARTPTS[a];[1:v]format=rgba,fade=in:st=0.08:d=0.22:alpha=1,fade=out:st=3.05:d=0.5:alpha=1[o];[v][o]overlay=0:0[vo]" \
    -map "[vo]" -map "[a]" \
    -r 24 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k "w$i.mp4"
done

printf "file 'w1.mp4'\nfile 'w2.mp4'\nfile 'w3.mp4'\nfile 'w4.mp4'\nfile 'w5.mp4'\nfile 'w6.mp4'\nfile 's5.mp4'\n" > list3.txt
ffmpeg -y -v error -f concat -safe 0 -i list3.txt -c:v copy -c:a aac -ar 44100 -b:a 128k mid.mp4

# mix VO over ducked ambient
ffmpeg -y -v error -i mid.mp4 -i vo.mp3 \
  -filter_complex "[0:a]volume=0.35[amb];[1:a]adelay=200|200,volume=1.9[vo];[amb][vo]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -ar 44100 -b:a 160k postaisociety-reel-ultra.mp4

ffprobe -v error -show_entries format=duration -of csv=p=0 postaisociety-reel-ultra.mp4
ls -la postaisociety-reel-ultra.mp4
