@echo off
@title bat execute git auto commit
C:
cd C:/jsdev/nodeproject
git add .
git commit -m "Code refactoring of project files"
git push -u origin main