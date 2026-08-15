#!/bin/bash
set -e
cd "$(dirname "$0")"

# inputs: b1..b5 new clips, b6 = n4 (empty table)
cp -f n4.mp4 b6.mp4

# each segment: trim to 3.5s, overlay with fade in/out
for i in 1 2 3 4 5 6; do
  ffmpeg -y -v error -i "b$i.mp4" -loop 1 -t 3.5 -i "ov2$i.png" \
    -filter_complex "[0:v]trim=0:3.5,setpts=PTS-STARTPTS[v];[0:a]atrim=0:3.5,asetpts=PTS-STARTPTS[a];[1:v]format=rgba,fade=in:st=0.1:d=0.3:alpha=1,fade=out:st=2.9:d=0.55:alpha=1[o];[v][o]overlay=0:0[vo]" \
    -map "[vo]" -map "[a]" \
    -r 24 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k "q$i.mp4"
done

printf "file 'q1.mp4'\nfile 'q2.mp4'\nfile 'q3.mp4'\nfile 'q4.mp4'\nfile 'q5.mp4'\nfile 'q6.mp4'\nfile 's5.mp4'\n" > list2.txt
ffmpeg -y -v error -f concat -safe 0 -i list2.txt -c copy postaisociety-reel-2.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 postaisociety-reel-2.mp4
ls -la postaisociety-reel-2.mp4
