#!/bin/bash
set -e
cd "$(dirname "$0")"

STYLE='fontfile=NewsreaderItalic.ttf:fontcolor=0xF4F0E8:fontsize=66:line_spacing=20:x=(w-text_w)/2:shadowcolor=black@0.6:shadowx=2:shadowy=3'
FADE="alpha='if(lt(t,0.35),t/0.35,if(lt(t,4.3),1,max(0,(5-t)/0.7)))'"

for i in 1 2 3 4; do
  ffmpeg -y -v error -i "c$i.mp4" \
    -vf "drawtext=${STYLE}:textfile=t$i.txt:y=1420:${FADE}" \
    -r 24 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k "s$i.mp4"
done

ffmpeg -y -v error \
  -f lavfi -i "color=c=0x211E19:s=1080x1920:d=3:r=24" \
  -f lavfi -t 3 -i "anullsrc=r=44100:cl=stereo" \
  -vf "drawtext=fontfile=Newsreader.ttf:text='THE POST-AI SOCIETY':fontcolor=0xF4F0E8:fontsize=54:x=(w-text_w)/2:y=900:alpha='min(1,t/0.6)',drawtext=fontfile=NewsreaderItalic.ttf:text='Italy, first.':fontcolor=0xA69D8B:fontsize=40:x=(w-text_w)/2:y=1000:alpha='min(1,max(0,(t-0.5)/0.6))'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 44100 -b:a 128k -shortest "s5.mp4"

printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\nfile 's4.mp4'\nfile 's5.mp4'\n" > list.txt
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy postaisociety-reel.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 postaisociety-reel.mp4
ls -la postaisociety-reel.mp4
