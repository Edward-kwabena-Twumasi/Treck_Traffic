@echo off
@title bat execute git auto commit
C:
cd C:/jsdev/nodeproject
git add .
git commit -m "Add streams for reading file to prevent heap out of memory.The streams cater for reading large files without memory outage"
git push -u origin main