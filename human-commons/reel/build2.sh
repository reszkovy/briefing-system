#!/bin/bash
set -e
cd "$(dirname "$0")"

for i in 1 2 3 4; do
  ffmpeg -y -v error -i "c$i.mp4" -loop 1 -t 5 -i "ov$i.png" \
    -filter_complex "[1:v]format=rgba,fade=in:st=0.15:d=0.4:alpha=1,fade=out:st=4.2:d=0.7:alpha=1[o];[0:v][o]overlay=0:0" \
    -r 24 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k -shortest "s$i.mp4"
done

ffmpeg -y -v error \
  -f lavfi -i "color=c=0x211E19:s=1080x1920:d=3:r=24" \
  -loop 1 -t 3 -i "ov5.png" \
  -f lavfi -t 3 -i "anullsrc=r=44100:cl=stereo" \
  -filter_complex "[1:v]format=rgba,fade=in:st=0.2:d=0.6:alpha=1[o];[0:v][o]overlay=0:0" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k -shortest "s5.mp4"

printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\nfile 's4.mp4'\nfile 's5.mp4'\n" > list.txt
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy postaisociety-reel.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 postaisociety-reel.mp4
ls -la postaisociety-reel.mp4
