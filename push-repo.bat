@echo off
@title bat execute git auto commit
C:
cd C:/jsdev/nodeproject
git add .
git commit -m "Departure expressed in seconds instead of milliseconds now"
git push -u origin main