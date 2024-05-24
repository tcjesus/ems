#!/bin/bash

# Setup Database
echo 'SETUP DATABASE';

# Migrations
echo 'RUN MIGRATIONS';
npm run migration:run;

# Seeds
echo 'RUN SEEDS';
npm run seed:run;

# Start
if [ $NODE_ENV = "development" ]; then
    echo 'RUN APPLICATION (DEV)';
    npm run start:dev;
else
    echo 'RUN APPLICATION (PROD)';
    npm run start:prod;
fi
