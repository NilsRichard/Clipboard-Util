del /s /q build\*
copy assets\icon.png build\icon.png
copy manifest.json build\manifest.json
copy src\*.html build
npx tsc