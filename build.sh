rm -f build/*
cp assets/icon.png build/icon.png
cp manifest.json build/manifest.json
cp src/*.html build/
npx tsc