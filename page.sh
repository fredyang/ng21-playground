ng build --configuration production --base-href /ng21-playground/ 
g go github-pages
rm *.js
mv dist/playground/browser/* .