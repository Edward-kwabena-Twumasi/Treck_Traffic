@echo off
@title bat execute git auto commit
C:
cd C:/jsdev/nodeproject
git add .
git commit -m "Automated google traffic data archiver"
git push -u origin main